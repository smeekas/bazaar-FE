import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

/**
 * Atlaskit components gate unreleased behaviour behind `fg('platform_*')` checks.
 * With no resolver registered those checks fall through to Atlassian's internal
 * feature gate client, which we never initialise — so every check logs
 * "Client must be initialized before using this method".
 *
 * Answering `false` keeps every platform flag off, which is the released
 * behaviour of each component.
 *
 * Import this module before any other Atlaskit import so the resolver is in
 * place by the time their modules evaluate.
 */
setBooleanFeatureFlagResolver(() => false);
