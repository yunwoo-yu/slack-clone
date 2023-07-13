import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FormEvent, useCallback, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';

// import useSWR from 'swr';

const LogIn = () => {
  const { data, mutate } = useSWR('/api/users', fetcher, {
    // dedupingInterval: 100000, 호출은 되지만 설정된 시간만큼은 캐시되어 있는 값을 불러옵니다. default = 2000
    // focusThrottleInterval : 3000, 포커스 시 재 호출은 되지만 설정한 시간 동안은 포커스 되어도 호출 하지 않도록 하는 옵션 default = 5000
    // errorRetryInterval: 알수 없는 이유로 에러가 났을 때 재요청 하도록 하는 옵션 default = 5000,
    // loadingTimeout: 요청에 대한 응답이 이 시간만큼 걸릴 경우 뭔가 조치를 취할 수 있다 default = 3000
    // errorRetryCount: 서버 문제 시 재 요청을 몇번 보낼건지,
    // revalidateOnFocus focus 시 재요청 보낼건지
  });

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          mutate(response.data, false);
        })
        .catch((error) => {
          setLogInError(error.response?.status === 401);
        });
    },
    [email, password],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Navigate to="/workspace/sleact/channel/일반" />;
  }

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
