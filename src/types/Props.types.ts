export interface ListProps<T> {
  headings: { [key: string]: string };
  data: T[];
  itemClick?: {
    link: string;
    key: string;
  };
  itemPin?: {
    key: string;
    click: (id: string) => void;
  };
  pinnedItems?: string[];
}

export interface ContainerProps {
  children: React.ReactNode;
  title: string;
  view: {
    value: string;
    onChange: (event: React.MouseEvent<HTMLElement>, value: string) => void;
  };
}
