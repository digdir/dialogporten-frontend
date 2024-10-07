# Changelog

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
