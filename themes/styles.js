export const contrastColor = (props) => props.theme.contrast;
export const contrastTransColor = (opacity) => (props) =>
  `${props.theme.contrastTrans}${opacity})`;
