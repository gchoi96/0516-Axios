import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useState } from "react";

const InputWrapper = styled.div`
  display: : flex;
  flex-direction: "row";
  margin-bottom: 20px;
`;

export default function SignIn() {
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const onChangeInput = (gubun) => (event) => {
    setInputValues((prev) => {
      return { ...prev, [gubun]: event.target.value };
    });
  };

  const onClickSignIn = async () => {
    if (Object.values(inputValues).filter((el) => !el).length > 0)
      alert("입력 누락");

    // 로그인 API 호출

    router.push("/mypage");
  };

  return (
    <div>
      <InputWrapper>
        email: <input onChange={onChangeInput("email")} />
      </InputWrapper>
      <InputWrapper>
        password: <input type="password" onChange={onChangeInput("password")} />
      </InputWrapper>
      <button onClick={onClickSignIn}>로그인</button>
    </div>
  );
}
