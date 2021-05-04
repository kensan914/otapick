import React, { useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

import RoundButton from "~/components/atoms/RoundButton";
import { useAuthState } from "~/contexts/AuthContext";
import { useProfileState } from "~/contexts/ProfileContext";
import { useAxios } from "~/hooks/useAxios";
import { BASE_URL } from "~/constants/env";
import { generateUuid4, isMobile, URLJoin } from "~/utils";

const ExceedMaxFavoriteModal = (props) => {
  const { isOpen, toggle } = props;

  const profileState = useProfileState();
  const authState = useAuthState();

  const noInputVal = "noInput";
  const selectValues = {
    [noInputVal]: "未選択",
    buy: "絶対買う",
    mightBuy: "買うかもしれない",
    dontBuy: "絶対買わない",
  };
  const [val, setVal] = useState(noInputVal);
  const [canSubmit, setCanSubmit] = useState(false);
  useEffect(() => {
    if (val in selectValues && val !== noInputVal) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [val]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoading, request } = useAxios(
    URLJoin(BASE_URL, "survey/pro-plan/"),
    "post",
    {
      data: { q1: val },
      thenCallback: () => {
        setSuccessMessage(
          "ご回答いただきありがとうございます！貴重なご意見は、今後のヲタピックの開発に役立てて参ります。"
        );
        setErrorMessage("");
      },
      catchCallback: () => {
        setSuccessMessage("");
        setErrorMessage("申し訳ございません。アンケートの送信に失敗しました。");
      },
      token: authState.token,
    }
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle} className={"text-muted"} centered>
      <ModalHeader toggle={toggle}>
        マイフォルダがお気に入りでいっぱいです
      </ModalHeader>
      <ModalBody>
        いつもご利用ありがとうございます。あなたのマイフォルダ内のお気に入り画像が上限を超えてしまったため、お気に入り登録に失敗しました。お気に入り画像を削除して空きを作りましょう。
        <br />
        <h6 className="mt-3">あなたのご意見をお聞かせください</h6>
        <Form>
          <FormGroup className="mb-1">
            <Label for="proplan-questionnaire" style={{ fontSize: 14 }}>
              もしお気に入り登録無制限などの特典が受けられる月300円の定額制プランがあったら...(アンケートですので実際に購入するわけではございません)
            </Label>
            <div className="d-flex" style={{ flexDirection: "row" }}>
              <Input
                type="select"
                name="select"
                id="proplan-questionnaire"
                onChange={(e) => {
                  setVal(e.target.value);
                }}
                className={`${isMobile ? "" : "rounded-pill"}`} // mobileはdefaultのstyleが適用されるため
              >
                {Object.entries(selectValues).map(([key, val]) => {
                  return (
                    <option key={key} value={key}>
                      {val}
                    </option>
                  );
                })}
              </Input>
              <RoundButton
                // 一度postがsuccessすると再送できない
                canSubmit={!successMessage && canSubmit}
                isLoading={isLoading}
                onClick={() => {
                  request();
                }}
                colorSet="nogi"
                style={{ fontSize: 14, width: 100 }}
              >
                送信
              </RoundButton>
            </div>

            {successMessage && (
              <div className="pt-1 pl-1 text-success" style={{ fontSize: 12 }}>
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="pt-1 pl-1 text-danger" style={{ fontSize: 12 }}>
                {errorMessage}
              </div>
            )}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <RoundButton
          onClick={() => {
            toggle();
          }}
          colorSet="gray"
        >
          キャンセル
        </RoundButton>
        <RoundButton
          to={{
            pathname: `/users/${profileState.profile.username}/`,
            state: { accessKey: generateUuid4() },
          }}
        >
          お気に入り画像を整理する
        </RoundButton>
      </ModalFooter>
    </Modal>
  );
};

export default ExceedMaxFavoriteModal;
