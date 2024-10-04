import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

/**
 * fetchData using function passed as dependency
 * return [] if data empty
 * start recursion over tree using loop, for each iteration:
 *  # get category order either using Title or id
 *  # if Title includes #, add category to list visible on home page
 *  # run recursion on children
 * after recursion and interation are done, sort results using order
 */

export const categoryTree = async (
  getCategories: () => Promise<{ data: Category[] }>,
): Promise<CategoryListElement[]> => {
  const res = await getCategories();

  if (!res.data) {
    return [];
  }

  const toShowOnHome: CategoryListElement['id'][] = [];
  const results = walkTree(res.data, toShowOnHome);
  updateShowOnHome(results, toShowOnHome);

  return results;
};

function walkTree(
  cats: Category[],
  toShowOnHome: CategoryListElement['id'][],
): CategoryListElement[] {
  if (cats.length === 0) return [];

  const results = cats.map((cat) => {
    const order = getCategoryOrder(cat);

    if (cat.Title && cat.Title.includes('#')) {
      toShowOnHome.push(cat.id);
    }

    return {
      id: cat.id,
      image: cat.MetaTagDescription,
      name: cat.name,
      order,
      children: walkTree(cat.children, toShowOnHome),
      showOnHome: false,
    };
  });

  results.sort(
    (a: CategoryListElement, b: CategoryListElement) => a.order - b.order,
  );

  return results;
}

function getCategoryOrder(cat: Category) {
  const order =
    cat.Title && cat.Title.includes('#') ? cat.Title.split('#')[0] : cat.Title;

  const parsedOrder = parseInt(order);
  return isNaN(parsedOrder) ? cat.id : parsedOrder;
}

function updateShowOnHome(
  catetories: CategoryListElement[],
  toShowOnHome: CategoryListElement['id'][],
) {
  // this will always iterate only through top-level items
  if (catetories.length <= 5) {
    catetories.forEach((a) => (a.showOnHome = true));
  } else if (toShowOnHome.length > 0) {
    catetories.forEach((x) => (x.showOnHome = toShowOnHome.includes(x.id)));
  } else {
    catetories.forEach((x, index) => (x.showOnHome = index < 3));
  }
}
