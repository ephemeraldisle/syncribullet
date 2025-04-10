import type { DeepWriteable } from '~/utils/helpers/types';
import type { ManifestCatalogItemType } from '~/utils/manifest';
import type { ReceiverServerConfig } from '~/utils/receiver/receiver-server';
import type { Receivers } from '~/utils/receiver/types/receivers';

import type { internalIds, syncIds } from '../constants';
import type { AnilistLibraryListEntry } from './anilist/library';
import type { AnilistCatalogStatus } from './catalog/catalog-status';
import type { AnilistCatalogType } from './catalog/catalog-type';

export type AnilistMCIT = ManifestCatalogItemType<
  Receivers.ANILIST,
  AnilistCatalogStatus,
  AnilistCatalogType
> & {
  auth?: {
    access_token: string;
    e: string;
    client_id?: string;
  };
  internalIds: DeepWriteable<typeof internalIds>;
  syncIds: DeepWriteable<typeof syncIds>;
  receiverServerConfig: ReceiverServerConfig<
    AnilistLibraryListEntry,
    AnilistLibraryListEntry
  >;
};
