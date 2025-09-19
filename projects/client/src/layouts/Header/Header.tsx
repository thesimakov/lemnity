import { Button } from "@heroui/button";
import logo from "../../assets/logos/logo.svg";
import ProfileButton from "../ProfileButton/ProfileButton";
import "./Header.css";
import iconLight from "../../assets/icons/light.svg";
import iconBell from "../../assets/icons/bell.svg";

const Header = () => {
  return (
    <header className="h-[70px] min-h-[70px] flex items-center justify-between mx-5">
      <div className="flex items-center">
        <a href="/" className="flex items-center">
          <img src={logo} alt="Lemnity" className="h-8 w-auto" />
        </a>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500 flex flex-row gap-2.5">
          <Button
            isIconOnly
            radius="full"
            className="bg-white w-[38px] h-[38px]"
            color="default"
          >
            <img
              src={iconLight}
              alt="Light"
              className="h-8 w-auto w-[19px] h-[19px]"
            />
          </Button>
          <Button
            isIconOnly
            radius="full"
            className="bg-white w-[38px] h-[38px]"
            color="default"
          >
            <img
              src={iconBell}
              alt="Bell"
              className="h-8 w-auto w-[19px] h-[19px]"
            />
          </Button>
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
