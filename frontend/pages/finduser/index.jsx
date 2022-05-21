import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import useAxios from "../../src/useAxios";

export default function SignIn() {
  const nickNameRef = useRef(null);
  const emailRef = useRef(null);

  const [nickNameResult, setNickNameResult] = useState({
    name: "",
    email: "",
    nickName: "",
  });
  const [emailResult, setEmailResult] = useState({
    name: "",
    email: "",
    nickName: "",
  });

  const [axios] = useAxios();
  //  url/users/byNickName/{이부분}
  //  url/users/byNickName/{이부분}

  // url/users/byEmail?email=asd@asd.asd
  // url/users/byEmail?email=asd@asd.asd

  const onClickNickNameSearch = async () => {
    if (!nickNameRef || !nickNameRef.current.value) return;
    try {
      // nickName으로 검색 API 호출
      const result = await axios.get(
        `/users/byNickName/${nickNameRef.current.value}`
      );

      console.log(result);
      const { name, nickName, email } = result.data.user;
      setNickNameResult({ name, nickName, email });
    } catch (err) {
      alert(err.message);
    }
  };
  const onClickEmailSearch = async () => {
    if (!emailRef || !emailRef.current.value) return;
    try {
      // email로 검색 API 호출

      const result = await axios.get(`/users/byEmail`, {
        params: { email: emailRef.current.value },
      });
      //->
      //`http://localhost:4000/users/byEmail?${email}=${emailRef.current.value}`;
      const { name, nickName, email } = result.data.user;
      setEmailResult({ name, nickName, email });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1>닉네임으로 유저 찾기</h1>
        <div>
          nickName: <input ref={nickNameRef} />
          <button onClick={onClickNickNameSearch}>검색</button>
        </div>
        <div>
          name : {nickNameResult.name}
          <br />
          email : {nickNameResult.email}
          <br />
          nickName : {nickNameResult.nickName}
        </div>
      </div>
      <div style={{ margin: "0px 0px 0px 100px" }}>
        <h1>email로 유저 찾기</h1>
        <div>
          email: <input ref={emailRef} />
          <button onClick={onClickEmailSearch}>검색</button>
        </div>
        <div>
          name : {emailResult.name}
          <br />
          email : {emailResult.email}
          <br />
          nickName : {emailResult.nickName}
        </div>
      </div>
    </div>
  );
}
