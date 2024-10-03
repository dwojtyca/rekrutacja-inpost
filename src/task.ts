import { Category, getCategories } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export const categoryTree = async (): Promise<CategoryListElement[]> => {
  const res = await getCategories();

  if (!res.data) {
    return [];
  }

  const toShowOnHome: number[] = [];

  const getCategory = (cat: Category) => {
    let order = cat.Title;
    if (cat.Title && cat.Title.includes('#')) {
      order = cat.Title.split('#')[0];
      toShowOnHome.push(cat.id);
    }

    let orderL = parseInt(order);
    if (isNaN(orderL)) {
      orderL = cat.id;
    }

    return {
      id: cat.id,
      image: cat.MetaTagDescription,
      name: cat.name,
      order: orderL,
      children: walkTree(cat.children),
      showOnHome: false,
    };
  };

  const walkTree = (cats: Category[]) => {
    if (cats.length === 0) return [];
    const result = cats.map((cat) => getCategory(cat));
    result.sort((a, b) => a.order - b.order);
    return result;
  };

  const result = walkTree(res.data);

  if (result.length <= 5) {
    result.forEach((a) => (a.showOnHome = true));
  } else if (toShowOnHome.length > 0) {
    result.forEach((x) => (x.showOnHome = toShowOnHome.includes(x.id)));
  } else {
    result.forEach((x, index) => (x.showOnHome = index < 3));
  }

  return result;
};
