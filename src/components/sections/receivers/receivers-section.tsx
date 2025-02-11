import { component$ } from '@builder.io/qwik';
import type { NoSerialize, PropFunction } from '@builder.io/qwik';

import type {
  ReceiverClients,
  Receivers,
} from '~/utils/receiver/types/receivers';

import ReceiversLiveSync from './receivers-live-sync';

export interface ReceiversSectionProps {
  receivers: { [key in Receivers]: NoSerialize<ReceiverClients> };
  onClick$: PropFunction<(id: Receivers) => void>;
}

export default component$<ReceiversSectionProps>(({ receivers, onClick$ }) => {
  return (
    <div class="p-6 w-full max-w-2xl rounded-xl border shadow-xl border-outline/20 bg-secondary-container text-on-secondary-container">
      <h2 class="w-full text-xl font-bold text-center md:text-3xl">
        Receivers
      </h2>
      <div class="flex flex-col gap-6 pt-5 md:flex-row">
        <ReceiversLiveSync receivers={receivers} onClick$={onClick$} />
      </div>
    </div>
  );
});
