// import { useCallback, useState } from "react"
// import {Button} from "@heroui/button"
// import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown"
// import SvgIcon from '../../components/SvgIcon'
// import userIcon from "../../assets/icons/user-circle.svg"
// import powerIcon from "../../assets/icons/power.svg"
// import chevronUp from "../../assets/icons/chevronUp.svg"
// import chevronDown from "../../assets/icons/chevronDown.svg"

// type ProfileActionKey = "profile" | "logout"

// const ProfileButton = () => {
//   const [isOpen, setIsOpen] = useState(false)

//   const handleAction = useCallback((key: React.Key) => {
//     const action = String(key) as ProfileActionKey
//     if (action === "profile") {
//       alert("profile")
//     }
//     if (action === "logout") {
//       alert("logout")
//     }
//   }, [])

//   return (
//     <Dropdown onOpenChange={(prev:boolean)=>setIsOpen(prev)} placement="bottom-end">
//       <DropdownTrigger>
//         <Button
//           variant="solid"
//           className="bg-[#F7FBFF] h-[38px] px-1 rounded-xl text-[#656565] font-roboto"
//           startContent={<SvgIcon src={userIcon} size={'30px'} />}
//           endContent={<SvgIcon src={isOpen ? chevronUp : chevronDown} size={'1rem'} />}
//         >
//         </Button>
//       </DropdownTrigger>
//       <DropdownMenu aria-label="Меню профиля" onAction={handleAction} itemClasses={{base: "px-3 py-2 rounded-[5px] hover:bg-[#F7FBFF]"}}>
//         <DropdownItem key="profile" startContent={<SvgIcon src={userIcon} size={20} className="opacity-80" />}>
//           <span className="font-roboto text-[13px] text-[#111]">Мой профиль</span>
//         </DropdownItem>
//         <DropdownItem key="logout" startContent={<SvgIcon src={powerIcon} size={20} className="opacity-80" />}>
//           <span className="font-roboto text-[13px] text-[#111]">Выйти</span>
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   )
// }

// export default ProfileButton
