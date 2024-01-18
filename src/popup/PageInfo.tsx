import { Page } from "../schemas.ts";

interface PageInfoProps {
  page: Page;
}

export const PageInfo = ({ page }: PageInfoProps) => {
  return <div>{page.name}</div>;
};
