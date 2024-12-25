import { Button, Card, Typography } from "antd";
import Lottie from "lottie-react";
import notfound from "../../assets/lotti/Page404.json";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
    const history = useNavigate()
  return (
    <>
      <div>
        <Lottie
          loop={true}
          autoPlay={true}
          animationData={notfound}
        />
        <Button type="primary" block  onClick={()=>history('/')}>กลับสู่หน้าหลัก</Button>
      </div>
    </>
  );
};
