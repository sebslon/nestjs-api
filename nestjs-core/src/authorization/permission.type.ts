import CategoriesPermission from './permissions/categories-permission.enum';
import PostsPermission from './permissions/posts-permission.enum';

const Permission = {
  ...PostsPermission,
  ...CategoriesPermission,
};

type Permission = PostsPermission | CategoriesPermission;

export default Permission;
