아이템 시뮬레이터.


계정을 만들고 캐릭터를 만들어서 아이템 만들어 착용해 보는 코드.

그리고 로그인, 회원가입만. html로 만들어봄. 연결도 됨.
api 앞에 ip적어야함. ip/api

회원가입          post    - /api/sign-up                                        body{ "loginId": "", "password":"", "verifyPassword":"", "name":""}
로그인            post    - /api/sign-in                                        body{ "loginId": "", "password":"" }
계정조회          get     - /api/accounts                                       headers {Authorization: 토큰넣기}
캐릭터 생성       post    - /api/characters                                     body{ "name":"" }  headers {Authorization: 토큰넣기}
캐릭터 목록 조회  get     - /api/characters
캐릭터 상세 조회  get     - /api/characters/characterId                      
캐릭터 삭제       delete  - /api/characters/characterId                         headers {Authorization: 토큰넣기}

아이템 생성       post    - /api/items                                          body{"name":"", "hp":"", "str":"", "price":""}
아이템 목록 조회  get     - /api/items
아이템 상세 조회  get     - /api/items/itemId
아이템 수정       put     - /api/items/itemId                                   body{"name":"", "hp":"", "str":"", "price":""}  headers {Authorization: 토큰넣기}
아이템 삭제       delete  - /api/items/itemId                                   headers {Authorization: 토큰넣기}
아이템 넣기       put     -/api/characters/characterId/CharacterInventorys      body{"itemId": ""}    headers {Authorization: 토큰넣기}

인벤토리 조회     get     -/api/characters/characterId/CharacterInventorys      headers {Authorization: 토큰넣기}
아이템 구매       put     -/api/characters/characterId/purchase                 body{"itemId": ""}    headers {Authorization: 토큰넣기}
아이템 판매       put     -/api/characters/characterId/sale                     body{"itemId": ""}    headers {Authorization: 토큰넣기}
돈 복사           put     -/api/characters/characterId/money                    headers {Authorization: 토큰넣기}

장비칸 확인       get     -/api/characters/characterId/characterItems           headers {Authorization: 토큰넣기}
아이템 장착       put     -/api/characters/characterId/equipped                 body{"itemId": ""}    headers {Authorization: 토큰넣기}
아이템 탈착       put     -/api/characters/characterId/detachment               body{"itemId": ""}    headers {Authorization: 토큰넣기}



