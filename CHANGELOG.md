# Changelog

## [1.8.5](https://github.com/digdir/dialogporten-frontend/compare/v1.8.4...v1.8.5) (2024-11-11)


### Bug Fixes

* Fix multiple browser history push when navigating and using search bar ([#1351](https://github.com/digdir/dialogporten-frontend/issues/1351)) ([90fa546](https://github.com/digdir/dialogporten-frontend/commit/90fa546ffdfaae761a3fe34bc371ff1142d4154f))

## [1.8.4](https://github.com/digdir/dialogporten-frontend/compare/v1.8.3...v1.8.4) (2024-11-08)


### Bug Fixes

* Back button will update application state based on query params ([#1350](https://github.com/digdir/dialogporten-frontend/issues/1350)) ([4480ae4](https://github.com/digdir/dialogporten-frontend/commit/4480ae40031b3f407d637fc0cce8974d64e6e826))
* Searchbar results will now reflect selected party. Added pre push hook. ([e15c158](https://github.com/digdir/dialogporten-frontend/commit/e15c158310c3734eb9d686e347ff5dbd465b9aec))
* Searchbar results. Added pre push tests. ([#1329](https://github.com/digdir/dialogporten-frontend/issues/1329)) ([e15c158](https://github.com/digdir/dialogporten-frontend/commit/e15c158310c3734eb9d686e347ff5dbd465b9aec))

## [1.8.3](https://github.com/digdir/dialogporten-frontend/compare/v1.8.2...v1.8.3) (2024-11-04)


### Bug Fixes

* improve query parameter consistency and state persistence across navigation ([#1328](https://github.com/digdir/dialogporten-frontend/issues/1328)) ([1ad78cb](https://github.com/digdir/dialogporten-frontend/commit/1ad78cbabb9a2e8f0fef302044b95d22739eb300))

## [1.8.2](https://github.com/digdir/dialogporten-frontend/compare/v1.8.1...v1.8.2) (2024-10-28)


### Bug Fixes

* Set min and max date values as default. Providing empty values will show all dialogs ([#1309](https://github.com/digdir/dialogporten-frontend/issues/1309)) ([5c1ad25](https://github.com/digdir/dialogporten-frontend/commit/5c1ad25845d23c680ec22b00881a48edf95ac4a7))

## [1.8.1](https://github.com/digdir/dialogporten-frontend/compare/v1.8.0...v1.8.1) (2024-10-28)


### Bug Fixes

* clear filters every time party is selected making it safe to switch + fix incorrect check for query defined selected org causing unwanted switch ([fe2c3e6](https://github.com/digdir/dialogporten-frontend/commit/fe2c3e68bbce4fedfa4fb63230ecd9843067ab77))

## [1.8.0](https://github.com/digdir/dialogporten-frontend/compare/v1.7.1...v1.8.0) (2024-10-25)


### Features

* GuiAction show spinner while awaiting response after click ([#1300](https://github.com/digdir/dialogporten-frontend/issues/1300)) ([92a0e41](https://github.com/digdir/dialogporten-frontend/commit/92a0e415acbb7f7066ec6167773119ee5759d0fc))

## [1.7.1](https://github.com/digdir/dialogporten-frontend/compare/v1.7.0...v1.7.1) (2024-10-24)


### Bug Fixes

* Save search button now behaves as expected. ([#1284](https://github.com/digdir/dialogporten-frontend/issues/1284)) ([27e1c06](https://github.com/digdir/dialogporten-frontend/commit/27e1c069cd08e4268cc9e51806c7b4f24288f5c3))

## [1.7.0](https://github.com/digdir/dialogporten-frontend/compare/v1.6.1...v1.7.0) (2024-10-23)


### Features

* Save search button will now reflect wether search already exists. ([#1270](https://github.com/digdir/dialogporten-frontend/issues/1270)) ([82dabd5](https://github.com/digdir/dialogporten-frontend/commit/82dabd543893c55d5ee06903bc2b8fde493e00b3))
* Saved search button will now reflect wether search already exists. ([82dabd5](https://github.com/digdir/dialogporten-frontend/commit/82dabd543893c55d5ee06903bc2b8fde493e00b3))


### Bug Fixes

* Added missing translations ([#1282](https://github.com/digdir/dialogporten-frontend/issues/1282)) ([313d5bb](https://github.com/digdir/dialogporten-frontend/commit/313d5bb92ac8f02b6ccff7a372a333ed47a90d30))
* allow refreshing of access token when graphql request is executed through graphiql IDE ([5ba3c5d](https://github.com/digdir/dialogporten-frontend/commit/5ba3c5db86460b96dda7289dee803cb853d944fe))
* Check on query response success variable to display correct snackbar messages, add tests ([#1277](https://github.com/digdir/dialogporten-frontend/issues/1277)) ([22edfcc](https://github.com/digdir/dialogporten-frontend/commit/22edfcc519efcf7c0820353e49211aea4cee3310))
* Counter on 'inbox' now reflects number of unread items ([#1278](https://github.com/digdir/dialogporten-frontend/issues/1278)) ([3d47049](https://github.com/digdir/dialogporten-frontend/commit/3d470496f9f589679654949e6e7a42042b754027))

## [1.6.1](https://github.com/digdir/dialogporten-frontend/compare/v1.6.0...v1.6.1) (2024-10-17)


### Bug Fixes

* date range of custom date period in filters was based on created date of dialogs, not updated date ([66811b7](https://github.com/digdir/dialogporten-frontend/commit/66811b707d8af5fc9b3667943e55a1d518d17c71))
* fix date input field styles and popup not showing ([#1243](https://github.com/digdir/dialogporten-frontend/issues/1243)) ([d9c5616](https://github.com/digdir/dialogporten-frontend/commit/d9c561615d49c423a90acd9a9cc71c028a26fc66))
* Fixed crashing behaviour when refreshing with query params ([#1247](https://github.com/digdir/dialogporten-frontend/issues/1247)) ([871ae5f](https://github.com/digdir/dialogporten-frontend/commit/871ae5f5bbd64f05162212030d230b16f58aad37))

## [1.6.0](https://github.com/digdir/dialogporten-frontend/compare/v1.5.0...v1.6.0) (2024-10-16)


### Features

* support legacy html as front channel embeds for main content reference ([85045f5](https://github.com/digdir/dialogporten-frontend/commit/85045f5db029b41b2d3e8865daae10f8bda05040))


### Bug Fixes

* Filter menu no longer covers global menu bar ([a3c8fb7](https://github.com/digdir/dialogporten-frontend/commit/a3c8fb7659feeefbb8182bc8dd1cc04f0ed425b8))
* Fixed menu button toggle button not closing the menu ([afe336e](https://github.com/digdir/dialogporten-frontend/commit/afe336e6520b5d12aa6431accbd1b6e807483438))
* Fixed menu button toggle button not closing the menu ([c990958](https://github.com/digdir/dialogporten-frontend/commit/c9909589672d409a70c9d134833cf13c5f43b233))
* SavedSearch action menu showing correctly on large screen sizes ([2427e3e](https://github.com/digdir/dialogporten-frontend/commit/2427e3ea03f5b26a0a6bcc5ef17261c20e77c8e0))

## [1.5.0](https://github.com/digdir/dialogporten-frontend/compare/v1.4.0...v1.5.0) (2024-10-14)


### Features

* refactor to support more flexibility when picking valueType based on langueCode ([2db72e9](https://github.com/digdir/dialogporten-frontend/commit/2db72e994faceda9ae76cef376767dfd5001855e))
* support text/markdown and text/html for additional info section in inbox details ([7b46733](https://github.com/digdir/dialogporten-frontend/commit/7b46733ea4b7c8c6ad7a38989637cf09b138a65a))


### Bug Fixes

* ensure attachment are only counted if they have urls with consumer type GUI ([18a7600](https://github.com/digdir/dialogporten-frontend/commit/18a7600d9fe64f62a57f47691a3a9b4708d96ed1))
* remove deprecated relatedActivityId ([046b2af](https://github.com/digdir/dialogporten-frontend/commit/046b2afd64b2ce933fedae64bb3572d8858acc81))

## [1.4.0](https://github.com/digdir/dialogporten-frontend/compare/v1.3.1...v1.4.0) (2024-10-07)


### Features

* add support for listing dialogs as archived or in bin and move dialogs to bin or archive ([5d4d667](https://github.com/digdir/dialogporten-frontend/commit/5d4d66707a625aaa8bdcfb9a96d16994f984407e))
* Organizations now being fetched in BFF and stored in Redis ([7c784b3](https://github.com/digdir/dialogporten-frontend/commit/7c784b381dd9c1eb4698805c05aecb18160ec3fd))


### Bug Fixes

* Updated according to PR comments ([accd02a](https://github.com/digdir/dialogporten-frontend/commit/accd02a1e6ddf47be898ee5ea7aaf19204f0941b))

## [1.3.1](https://github.com/digdir/dialogporten-frontend/compare/v1.3.0...v1.3.1) (2024-10-04)


### Bug Fixes

* fixes auth issues in bff ([e809b86](https://github.com/digdir/dialogporten-frontend/commit/e809b8681a3c30be35607941223fa1a2aaec9986))

## [1.3.0](https://github.com/digdir/dialogporten-frontend/compare/v1.2.0...v1.3.0) (2024-10-03)


### Features

* Party now stored in URL as query param for organizations ([c2afe7a](https://github.com/digdir/dialogporten-frontend/commit/c2afe7a8e4707b2026a5108ed6cf78208271d698))


### Bug Fixes

* adds missing sub parties to partylist ([2560750](https://github.com/digdir/dialogporten-frontend/commit/2560750baffbc159e00694547b16602bb48ae249))
* improvements to auth / refresh flow ([076d7d6](https://github.com/digdir/dialogporten-frontend/commit/076d7d656ed66502caabffbeeae8b1b16e8ce813))

## [1.2.0](https://github.com/digdir/dialogporten-frontend/compare/v1.1.1...v1.2.0) (2024-10-01)


### Features

* add dialog token as headers for graphql subscription on dialogEvents ([d5379fd](https://github.com/digdir/dialogporten-frontend/commit/d5379fd6754d544b49607e9fbc97d868af5ac4f3))
* **frontend:** enable application insights ([#1177](https://github.com/digdir/dialogporten-frontend/issues/1177)) ([f8d47ea](https://github.com/digdir/dialogporten-frontend/commit/f8d47ea2c8ce4d6fd71d0eb689d079f70df2b74d))
* refactor context menu for button actions for saved searches ([93668eb](https://github.com/digdir/dialogporten-frontend/commit/93668ebe2e29e447b6c4023bfe2e124650575447))


### Bug Fixes

* **frontend:** avoid instrumenting application insights if bad key ([#1195](https://github.com/digdir/dialogporten-frontend/issues/1195)) ([558aaab](https://github.com/digdir/dialogporten-frontend/commit/558aaab53ef7257b85842e73b5d5b068b2d8ed82))

## [1.1.1](https://github.com/digdir/dialogporten-frontend/compare/v1.1.0...v1.1.1) (2024-09-27)


### Bug Fixes

* add padding for 404 dialog not found fallback ([3cd4ebe](https://github.com/digdir/dialogporten-frontend/commit/3cd4ebe6573b2a27008c1ade15660285c4c6d1eb))
* Global menu bar bug on mobile using Safari ([35c48d3](https://github.com/digdir/dialogporten-frontend/commit/35c48d3c18e0de88dacc77cdc560a2b718d1ec43))
* incorrect casing on svg attributes ([cfd6b1e](https://github.com/digdir/dialogporten-frontend/commit/cfd6b1eaa9889493fc551371310740492587cc34))
* redesign meta field and status fields ([6ba8ac7](https://github.com/digdir/dialogporten-frontend/commit/6ba8ac730e534b6f9bf6ebb3635c810c80f65e0e))

## [1.1.0](https://github.com/digdir/dialogporten-frontend/compare/v1.0.2...v1.1.0) (2024-09-26)


### Features

* Summary field now has maximum two lines, overflow will be cut with ellipsis ([5f1f507](https://github.com/digdir/dialogporten-frontend/commit/5f1f507c33b97c464f14afbb62fcda59a8341671))


### Bug Fixes

* align elements in inbox details ([424256b](https://github.com/digdir/dialogporten-frontend/commit/424256b8f3908b0d175c2f76bf527c23c48face9))
* Filter label names ([135b22f](https://github.com/digdir/dialogporten-frontend/commit/135b22f8088862f87773168493eef8cbbd540071))
* Seen by bug ([ea2079d](https://github.com/digdir/dialogporten-frontend/commit/ea2079d8cca2a409ba56bc206ff390edba2ce9f7))

## [1.0.2](https://github.com/digdir/dialogporten-frontend/compare/v1.0.1...v1.0.2) (2024-09-26)


### Bug Fixes

* change format for date and display updated date instead of create date ([36414fa](https://github.com/digdir/dialogporten-frontend/commit/36414fae59eb55fa4a72bdd2b76e6f9297ab4b7a))
* font-weight for title in InboxItem, differing between read and unread ([4b15a56](https://github.com/digdir/dialogporten-frontend/commit/4b15a5620c4652a2a69529c7465ce09b4abe9488))
* merge to a single group of inbox items in for the viewtypes draft and sent ([f4587b8](https://github.com/digdir/dialogporten-frontend/commit/f4587b8f7640c639e31d1cfd6b5befba03f776c3))
* remove section header for activities and attachments if respective lists are empty ([d7cd488](https://github.com/digdir/dialogporten-frontend/commit/d7cd488df913b0ddb8c43a5538559002c62253f4))
* selected parties being nuked and improvements to app cache ([f02b818](https://github.com/digdir/dialogporten-frontend/commit/f02b8188237f567b45e234f39fa5e594679b4059))
* Unread status for search results ([0fc465a](https://github.com/digdir/dialogporten-frontend/commit/0fc465ad1ebe24e1cb9721864b7a81f7ecb2696e))
* use correct profile for avatar as sender in Inbox item detail page ([05ce083](https://github.com/digdir/dialogporten-frontend/commit/05ce0834736fe1cb40d0e6e1b97a6c074071be63))

## [1.0.1](https://github.com/digdir/dialogporten-frontend/compare/v1.0.0...v1.0.1) (2024-09-25)


### Bug Fixes

* Seen logic now works as expected ([ffa5265](https://github.com/digdir/dialogporten-frontend/commit/ffa52651e82e3b5b205fdfa9fdba8f28d739a2c5))
