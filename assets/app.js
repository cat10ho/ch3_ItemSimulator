const BASE_URL = 'http://localhost:3018/api'; // 백엔드 API 주소
let token = null; // 로그인 후 저장된 토큰

// 회원가입 처리
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const loginId = document.getElementById('signUpLoginId').value;
  const password = document.getElementById('signUpPassword').value;
  const verifyPassword = document.getElementById('signUpVerifyPassword').value;
  const name = document.getElementById('signUpName').value;

  try {
    const response = await fetch(`${BASE_URL}/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId, password, verifyPassword, name }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
    } else {
      alert(result.message || '회원가입에 실패했습니다.');
    }
  } catch (error) {
    alert('오류가 발생했습니다.');
    console.error(error);
  }
});

// 로그인 처리
document.getElementById('signInForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const loginId = document.getElementById('signInLoginId').value;
  const password = document.getElementById('signInPassword').value;

  try {
    const response = await fetch(`${BASE_URL}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId, password }),
    });

    const result = await response.json();
    if (response.ok) {
      token = result.token; // 토큰 저장
      alert(result.message);
    } else {
      alert(result.message || '로그인에 실패했습니다.');
    }
  } catch (error) {
    alert('오류가 발생했습니다.');
    console.error(error);
  }
});

// 계정 조회 처리
document.getElementById('getAccountInfo').addEventListener('click', async () => {
  if (!token) {
    alert('로그인이 필요합니다.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/accounts`, {
      method: 'GET',
      headers: {
        'Authorization': token, // 저장된 토큰을 헤더에 포함
      },
    });

    const result = await response.json();
    if (response.ok) {
      const accountInfo = result.data;
      const accountDiv = document.getElementById('account-info');
      accountDiv.innerHTML = `
        <h3>내 계정 정보</h3>
        <p>아이디: ${accountInfo.loginId}</p>
        <p>이름: ${accountInfo.name}</p>
        <p>생성일: ${new Date(accountInfo.createdAt).toLocaleString()}</p>
        <p>수정일: ${new Date(accountInfo.updatedAt).toLocaleString()}</p>
      `;
    } else {
      alert(result.message || '계정 정보를 불러오지 못했습니다.');
    }
  } catch (error) {
    alert('오류가 발생했습니다.');
    console.error(error);
  }
});