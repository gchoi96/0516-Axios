import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAxios from "../../src/useAxios";
const InputWrapper = styled.div`
  display: : flex;
  flex-direction: "row";
  margin-bottom: 20px;
`;

export default function MyPage() {
  const [inputValues, setInputValues] = useState({
    email: "",
    name: "",
    password: "",
    nickName: "",
    year: 0,
    month: 0,
    day: 0,
  });

  const [initValues, setInitValues] = useState({
    email: "",
    name: "",
    password: "",
    nickName: "",
    year: 0,
    month: 0,
    day: 0,
  });

  const router = useRouter();
  const [axios] = useAxios();
  useEffect(() => {
    const getUserInfo = async () => {
      // 내 정보 조회 API 호출
      const result = await axios.get("/users/loggedInUser");
      console.log(result);
      setInputValues(result.data.user);
      setInitValues(result.data.user);
    };
    getUserInfo();
  }, []);

  const onChangeInput = (gubun) => (event) => {
    const newValue = ["year", "month", "day"].includes(gubun)
      ? Number(event.target.value)
      : event.target.value;
    setInputValues((prev) => {
      return { ...prev, [gubun]: newValue };
    });
  };

  const onClickUpdate = async () => {
    if (initValues === inputValues) alert("변경사항 없음");
    try {
      // 회원 정보 수정 API 호출
      const result = axios.patch("/users", inputValues);
    } catch (err) {
      alert(err.message);
    }
  };

  const onClickDelete = async () => {
    try {
      // 회원 탈퇴 API 호출

      const result = axios.delete("/users");
      localStorage.removeItem("accessToken");
      router.push("/signup");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <InputWrapper>
        email:{" "}
        <input onChange={onChangeInput("email")} value={inputValues.email} />
      </InputWrapper>
      <InputWrapper>
        name:{" "}
        <input onChange={onChangeInput("name")} value={inputValues.name} />
      </InputWrapper>
      <InputWrapper>
        password:{" "}
        <input
          type="password"
          onChange={onChangeInput("password")}
          value={inputValues.password}
        />
      </InputWrapper>
      <InputWrapper>
        nickName:{" "}
        <input
          onChange={onChangeInput("nickName")}
          value={inputValues.nickName}
        />
      </InputWrapper>
      <InputWrapper>
        birthDate:{" "}
        <input
          type="number"
          onChange={onChangeInput("year")}
          value={inputValues.year}
        />
        년
        <input
          type="number"
          onChange={onChangeInput("month")}
          value={inputValues.month}
        />
        월
        <input
          type="number"
          onChange={onChangeInput("day")}
          value={inputValues.day}
        />
        일
      </InputWrapper>
      <InputWrapper>
        <button onClick={onClickUpdate}>수정</button>
        <button onClick={onClickDelete}>삭제</button>
      </InputWrapper>
    </div>
  );
}
