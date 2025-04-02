import { $, component$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

import { move, useForm } from '@modular-forms/qwik';
import type { SubmitHandler } from '@modular-forms/qwik';

import type { KnownNoSerialize } from '~/utils/helpers/qwik-types';
import type {
  ReceiverClients,
  ReceiverMCITypes,
} from '~/utils/receiver/types/receivers';
import type { UserSettingsForm } from '~/utils/receiver/types/user-settings/form';

import { Button } from '../buttons/button';
import Tab from '../tabs/tab';
import Subtitle from '../titles/subtitle';

export interface ManifestSettingsProps {
  currentReceiver: KnownNoSerialize<ReceiverClients>;
  updateReceiver$: PropFunction<() => void>;
}

type ManifestSettingsTab = 'Catalogs' | 'Live Sync' | 'Credentials';

export default component$<ManifestSettingsProps>(
  ({ currentReceiver, updateReceiver$ }) => {
    type FormSettings = UserSettingsForm<ReceiverMCITypes>;

    const userConfig = useSignal(currentReceiver.getUserConfig());

    const currentCatalogs = useSignal(
      currentReceiver.getManifestCatalogItems(
        userConfig.value?.catalogs?.map((catalog) => catalog.id),
      ),
    );

    const currentLiveSyncTypes = useSignal(
      currentReceiver.getLiveSyncTypes(userConfig.value?.liveSync),
    );

    const formDefault = useSignal<FormSettings>({
      catalogs: currentReceiver.manifestCatalogItems.map((catalog) => ({
        id: catalog.id,
        name: catalog.name,
        value: currentCatalogs.value.includes(catalog),
      })),
      liveSync: currentReceiver.liveSyncTypes.map((liveSync) => ({
        id: liveSync,
        value: currentLiveSyncTypes.value.includes(liveSync),
      })),
    });

    const [formStore, { Form, Field, FieldArray }] = useForm<FormSettings>({
      loader: formDefault,
      fieldArrays: ['catalogs', 'liveSync'],
    });

    const moveCatalogUp = $((index: number) => {
      if (index > 0) {
        move(formStore, 'catalogs', { from: index, to: index - 1 });
      }
    });

    const moveCatalogDown = $((index: number) => {
      if (index < formDefault.value.catalogs.length - 1) {
        move(formStore, 'catalogs', { from: index, to: index + 1 });
      }
    });

    const handleSubmit = $<SubmitHandler<FormSettings>>((values) => {
      // Extract the selected catalogs in their current order
      const selectedCatalogs = values.catalogs
        .filter(catalog => catalog.value)
        .map(catalog => currentReceiver.manifestCatalogItems.find(
          item => item.id === catalog.id
        ))
        .filter(Boolean) as (typeof currentReceiver.manifestCatalogItems)[number][];
      
      // Determine if the selected catalogs have changed from the defaults
      const catalogValues = 
        JSON.stringify(selectedCatalogs.map(c => c.id)) !== 
        JSON.stringify([...currentReceiver.defaultCatalogs])
          ? selectedCatalogs
          : undefined;

      const liveSyncValues =
        JSON.stringify(
          values.liveSync
            .filter((catalog) => catalog.value)
            .map((catalog) => catalog.id)
            .sort((a, b) => a.localeCompare(b)),
        ) !==
        JSON.stringify(
          [...currentReceiver.liveSyncTypes].sort((a, b) => a.localeCompare(b)),
        )
          ? currentReceiver.getLiveSyncTypes(
              values.liveSync
                .filter((liveSync) => liveSync.value)
                .map((liveSync) => liveSync.id),
            )
          : undefined;

      currentReceiver.mergeUserConfig({
        catalogs: catalogValues,
        liveSync: liveSyncValues,
      });
      updateReceiver$();
    });

    const activeTab = useSignal<ManifestSettingsTab>('Catalogs');

    return (
      <Form onSubmit$={handleSubmit} shouldActive={false} class="w-full">
        <div class="flex flex-col gap-4 w-full">
          <div class="flex">
            <Subtitle>Settings</Subtitle>
          </div>
          <Tab
            activeTab={activeTab.value.toString()}
            tabs={['Catalogs', 'Live Sync', 'Credentials']}
            onTabChange$={(tab) => {
              activeTab.value = tab as ManifestSettingsTab;
            }}
          >
            <div class={`${activeTab.value !== 'Catalogs' && 'hidden'}`}>
              <FieldArray name="catalogs">
                {(fieldArray) => (
                  <div
                    id={fieldArray.name}
                    class="grid grid-cols-1 w-full gap-4"
                  >
                    {fieldArray.items.map((item, index) => (
                      <div 
                        key={item}
                        class="p-3 rounded-lg border border-outline/20 flex items-center"
                      >
                        <div class="flex flex-col mr-2">
                          <button 
                            type="button" 
                            class="text-outline/50 hover:text-primary"
                            onClick$={() => moveCatalogUp(index)}
                            disabled={index === 0}
                          >
                            ▲
                          </button>
                          <button 
                            type="button" 
                            class="text-outline/50 hover:text-primary"
                            onClick$={() => moveCatalogDown(index)}
                            disabled={index === fieldArray.items.length - 1}
                          >
                            ▼
                          </button>
                        </div>
                        <Field name={`catalogs.${index}.value`} type="boolean">
                          {(field, props) => (
                            <div class="flex flex-row gap-2 flex-1">
                              <div>
                                <input
                                  type="checkbox"
                                  placeholder="List"
                                  class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0"
                                  checked={field.value}
                                  {...props}
                                />
                              </div>
                              <Field name={`catalogs.${index}.id`}>
                                {(idField) => {
                                  const catalogItem = currentReceiver.manifestCatalogItems.find(
                                    (catalog) => catalog.id === idField.value
                                  );
                                  return (
                                    <div class="text-start">
                                      <p class="text-sm pt-0.5">
                                        {catalogItem?.name}
                                      </p>
                                      <p class="text-xs">
                                        {catalogItem?.type}
                                      </p>
                                    </div>
                                  );
                                }}
                              </Field>
                            </div>
                          )}
                        </Field>
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
            </div>
            <div class={`${activeTab.value !== 'Live Sync' && 'hidden'}`}>
              <FieldArray name="liveSync">
                {(fieldArray) => (
                  <div
                    id={fieldArray.name}
                    class="grid grid-cols-1 w-full gap-4"
                  >
                    {fieldArray.items.map((item, index) => (
                      <div key={item}>
                        <Field name={`liveSync.${index}.value`} type="boolean">
                          {(field, props) => (
                            <div class="flex flex-row gap-2">
                              <div>
                                <input
                                  type="checkbox"
                                  placeholder="List"
                                  class="font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0"
                                  checked={field.value}
                                  {...props}
                                />
                              </div>
                              <div class="text-start">
                                <p>{currentReceiver.liveSyncTypes[index]}</p>
                              </div>
                            </div>
                          )}
                        </Field>
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
            </div>
            <div class={`${activeTab.value !== 'Credentials' && 'hidden'}`}>
              <div class="flex flex-col gap-2">
                <p class="text-error text-start">
                  This will clear all credentials and remove all the settings
                  associated with {currentReceiver.receiverInfo.text}. Resetting
                  to the default settings.
                </p>
                <div class="flex">
                  <Button
                    type="button"
                    borderColour="border-error"
                    backgroundColour="bg-error"
                    onClick$={async () => {
                      currentReceiver.removeUserConfig();
                      updateReceiver$();
                    }}
                  >
                    Remove Credentials
                  </Button>
                </div>
              </div>
            </div>
          </Tab>
          <div class="flex flex-row gap-2">
            <button
              type="submit"
              class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline bg-primary/30`}
            >
              Save Settings
            </button>
          </div>
        </div>
      </Form>
    );
  },
);
