2024-11-23
*는 수정하고 싶은 사항입니다.

한것.
1. 현재 계정생성,로그인,계정조회,캐릭터생성,캐릭터 목록조회, 캐릭터 상세조회*,캐릭터삭제,
아이템 생성,아이템 목록조회,아이템 상세 조회, 수정과 삭제를 구현함.

문제점.
1. 이놈의 인벤토리안에 아이템이 문제임. 일단 인벤토리 아이템을 꺼내려면 인벤토리 아이디와 맞는 아이템을 나열하는 수밖에 없다.
-json 형태로 넣으면 될거같긴 한테 그럼 어캐 제한하냐 이거임. 이대로 감행해도 되긴함. 물어보던가.

2.캐릭터 상세 조회와 삭제 에서
const  characterId  = req.params.charactersId; 이거 월래
const  {characterId}  = req.params; 이건데 이러면 안됨 왜인지는 모름.
아이템들은 const { itemId } = req.params; 잘 되는데. 왜일까.

해야할것.
1. 아이템 인벤토리에 넣기.
2. 아이템 장비 장착 하기.
3. 아이템 탈착하기.
4. 뽑기 시스템 구현해보기. 돈으로 하는거임.
5. 제일 중요한 html과 연결해 보기.->뽑기 모양은 이미 됬다.
6. 이건 딱히 안중요한거긴 한데 아이템 만들거나 수정할때 비어있으면 오류뜸. 이거 수정할 시간있으면 하던가.

뭐 이정도. 딴건