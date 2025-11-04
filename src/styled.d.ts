import "styled-components";
import { Theme } from "./types/theme.types";

// styled-components의 DefaultTheme을 확장합니다.
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
