# Changelog

## [1.1.0](https://github.com/digdir/dialogporten-frontend/compare/bff-v1.0.0...bff-v1.1.0) (2024-07-02)


### Features

* add graphql-request for fetching data with example ([#543](https://github.com/digdir/dialogporten-frontend/issues/543)) ([668eff9](https://github.com/digdir/dialogporten-frontend/commit/668eff9bff7d521c8032cb538528b8a8fb169ad4))
* add log out feature ([8a65a21](https://github.com/digdir/dialogporten-frontend/commit/8a65a2165983d87ba560bdb068daa6d950dfa8a3))
* Added fromView functionality, removed compression in query params ([#770](https://github.com/digdir/dialogporten-frontend/issues/770)) ([85ca8d5](https://github.com/digdir/dialogporten-frontend/commit/85ca8d57207614b684ff2838a835138921e832e5))
* **auth:** Add logout route ([#456](https://github.com/digdir/dialogporten-frontend/issues/456)) ([8a65a21](https://github.com/digdir/dialogporten-frontend/commit/8a65a2165983d87ba560bdb068daa6d950dfa8a3))
* **auth:** refresh auth tokens when they expire ([#457](https://github.com/digdir/dialogporten-frontend/issues/457)) ([286544d](https://github.com/digdir/dialogporten-frontend/commit/286544d557dcd1751beec54eb52a2391df63af3e))
* **bff:** update DB migration code [#553](https://github.com/digdir/dialogporten-frontend/issues/553) ([900e392](https://github.com/digdir/dialogporten-frontend/commit/900e392fc6867003caaf936909cb7fc0ebfc85e9))
* codegen for frontend based on GraphQL types in the BFF ([#541](https://github.com/digdir/dialogporten-frontend/issues/541)) ([6a2f53e](https://github.com/digdir/dialogporten-frontend/commit/6a2f53e33338fedeeeda0c4ef73570ff3a03c2c3))
* fetching parties with gql function and types generated from stiched schema ([570e764](https://github.com/digdir/dialogporten-frontend/commit/570e764022966e3a082c4d000493435dc380f603))
* graphql endpoint in bff ([524d495](https://github.com/digdir/dialogporten-frontend/commit/524d495aff4c1777c9ffc2de4b1c6643002c3538))
* improve login flow for app ([#436](https://github.com/digdir/dialogporten-frontend/issues/436)) ([#452](https://github.com/digdir/dialogporten-frontend/issues/452)) ([d359849](https://github.com/digdir/dialogporten-frontend/commit/d359849b43860d4831e4bc47f4b5428d20a9713e))
* map dialog search dialogs to dialogs + minor styling fixes ([2b0ba5e](https://github.com/digdir/dialogporten-frontend/commit/2b0ba5e75790c39cbb51d303b7e03f4c1f10ad8d))
* move user endpoint to graphql schema with resolver ([a6e488e](https://github.com/digdir/dialogporten-frontend/commit/a6e488e0799a4542ccfc768838d11af8b7ce4c16))
* setup Redis in `bff` as storage for sessions ([67ae240](https://github.com/digdir/dialogporten-frontend/commit/67ae240e48f8d9963a81e26e0e66c45e7eaa853d))
* setup vitest for all packages ([a60e9b4](https://github.com/digdir/dialogporten-frontend/commit/a60e9b40b977bce24c61be45dd44af1dbaa26ada))
* stitch Dialogporten-backend-GraphQL and BFF-GraphQL together to one ([6a10124](https://github.com/digdir/dialogporten-frontend/commit/6a10124ab1b0ff29b7da56d12fe7f984901d4628))
* support multiselect filters ([4cd3311](https://github.com/digdir/dialogporten-frontend/commit/4cd3311ae0453a9ffc9cdfc0e7e7d55247a1e885))


### Bug Fixes

* actually use the port variable ([d735613](https://github.com/digdir/dialogporten-frontend/commit/d735613b3d0aaa4ffec9a80110adacc211143e61))
* another quickfix for making DOckerfile in bff work ([30de172](https://github.com/digdir/dialogporten-frontend/commit/30de1720a35c2cc85240b267dd7be9979b47ebe7))
* await start functions to ensure errors are logged ([#519](https://github.com/digdir/dialogporten-frontend/issues/519)) ([844c66d](https://github.com/digdir/dialogporten-frontend/commit/844c66d533ee4143c908cbdd7c61949dab207467))
* **azure:** add application insights and create container app env ([#333](https://github.com/digdir/dialogporten-frontend/issues/333)) ([13aa6ca](https://github.com/digdir/dialogporten-frontend/commit/13aa6ca097c456f93a5af66fe04873b3591ea740))
* **bff:** add the correct graphql endpoint ([#611](https://github.com/digdir/dialogporten-frontend/issues/611)) ([5780856](https://github.com/digdir/dialogporten-frontend/commit/57808562a3f706839c598373a278b83b46849d7f))
* **bff:** avoid running app on migration ([#361](https://github.com/digdir/dialogporten-frontend/issues/361)) ([038ca12](https://github.com/digdir/dialogporten-frontend/commit/038ca12b7ef900edd41994564da1ff617d1fb051))
* **bff:** bff migrations ([#555](https://github.com/digdir/dialogporten-frontend/issues/555)) ([32b8075](https://github.com/digdir/dialogporten-frontend/commit/32b80756f392cb7857d8023456f61c741b70e879))
* **bff:** fix migration job ([#358](https://github.com/digdir/dialogporten-frontend/issues/358)) ([9e9f478](https://github.com/digdir/dialogporten-frontend/commit/9e9f478cef83d7e35dbf97a23f3179322704f35f))
* **bff:** start script ([#556](https://github.com/digdir/dialogporten-frontend/issues/556)) ([60aefc5](https://github.com/digdir/dialogporten-frontend/commit/60aefc5845c9335c7ff34e3be23fe54cb167f5af))
* **bff:** use correct command in dockerfile ([#380](https://github.com/digdir/dialogporten-frontend/issues/380)) ([33bdd7b](https://github.com/digdir/dialogporten-frontend/commit/33bdd7bd25a1037f946a8d849b934b6309e4357b))
* clean up bff and login ([f96eab1](https://github.com/digdir/dialogporten-frontend/commit/f96eab1e1b8f298433e673a63bee44f64bff8e27))
* ensure tls in Redis connection string and fix health checks ([#523](https://github.com/digdir/dialogporten-frontend/issues/523)) ([27ebed0](https://github.com/digdir/dialogporten-frontend/commit/27ebed0dbcf931a069ed4d6e7d7556812a8fad53))
* fixes logout not working ([#517](https://github.com/digdir/dialogporten-frontend/issues/517)) ([7048ee9](https://github.com/digdir/dialogporten-frontend/commit/7048ee9d8896ca36a1b52ad5c1470a2fb1a59f16))
* quickfix for broken docker command ([316367d](https://github.com/digdir/dialogporten-frontend/commit/316367de4308b1dd0444b0bd8388f67140d18a16))
* Refactoring bff and removing old frontend ([#375](https://github.com/digdir/dialogporten-frontend/issues/375)) ([05d904c](https://github.com/digdir/dialogporten-frontend/commit/05d904c100e1dd0dbb3a3af94757e11f3b4a08b5))
* some BFF rafactoring ([bd729f8](https://github.com/digdir/dialogporten-frontend/commit/bd729f81db90a086092850b8337bf3432d2debd8))
