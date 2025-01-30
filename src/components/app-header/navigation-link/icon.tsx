import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";

export type IconName = "burger" | "list" | "profile";

export function Icon(props: {
  className?: string;
  iconName: IconName;
  type?: "secondary" | "primary" | "error" | "success" | "disabled";
}) {
  if (props.iconName == "burger")
    return (
      <BurgerIcon className={props.className} type={props.type ?? "primary"} />
    );
  if (props.iconName == "list")
    return (
      <ListIcon className={props.className} type={props.type ?? "primary"} />
    );
  if (props.iconName == "profile")
    return (
      <ProfileIcon className={props.className} type={props.type ?? "primary"} />
    );

  // return (<CurrencyIcon type="primary" />)
  // return (<LockIcon type="primary" />)
  // return (<DragIcon type="primary" />
  // return (<CloseIcon type="primary" />)
  // return (<CheckMarkIcon type="primary" />)
  // return (<EditIcon type="primary" />)
  // return (<InfoIcon type="primary" />)
  // return (<ShowIcon type="primary" />)
  // return (<HideIcon type="primary" />)
  // return (<LogoutIcon type="primary" />)
  // return (<DeleteIcon type="primary" />)
  // return (<ArrowUpIcon type="primary" />)
  // return (<ArrowDownIcon type="primary" />)
  // return (<MenuIcon type="primary" />)
}
