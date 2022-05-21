import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
const InputWrapper = styled.div`
  display: : flex;
  flex-direction: "row";
  margin-bottom: 20px;
`;

export default function SignUp() {
  const [inputValues, setInputValues] = useState({
    email: "",
    name: "",
    password: "",
    nickName: "",
    year: 0,
    month: 0,
    day: 0,
  });

  const router = useRouter();

  const onChangeInput = (gubun) => (event) => {
    const newValue = ["year", "month", "day"].includes(gubun)
      ? Number(event.target.value)
      : event.target.value;
    setInputValues((prev) => {
      return { ...prev, [gubun]: newValue };
    });
  };

  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
  });

  const onClickSignUp = async () => {
    if (Object.values(inputValues).filter((el) => !el).length > 0)
      alert("입력 누락");

    // 회원가입 API 호출
    // const result = await axios.post("http://localhost:4000/users", inputValues);
    const result = await axiosInstance.post("/users", inputValues);
    console.log(result);
    // router.push("/signin");
  };

  return (
    <div>
      <InputWrapper>
        email: <input onChange={onChangeInput("email")} />
      </InputWrapper>
      <InputWrapper>
        name: <input onChange={onChangeInput("name")} />
      </InputWrapper>
      <InputWrapper>
        password: <input type="password" onChange={onChangeInput("password")} />
      </InputWrapper>
      <InputWrapper>
        nickName: <input onChange={onChangeInput("nickName")} />
      </InputWrapper>
      <InputWrapper>
        birthDate: <input type="number" onChange={onChangeInput("year")} />년
        <input type="number" onChange={onChangeInput("month")} />월
        <input type="number" onChange={onChangeInput("day")} />일
      </InputWrapper>
      <button onClick={onClickSignUp}>회원가입</button>
    </div>
  );
}
