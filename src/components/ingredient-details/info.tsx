export function Info(props: { lable: string; value?: string | number }) {
  return (
    <div className="text_type_main-small text_color_inactive">
      {props.lable}
      <div className="text_type_main-medium">{props.value}</div>
    </div>
  );
}
