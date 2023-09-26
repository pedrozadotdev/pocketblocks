import crud from "./crud";
import home from "./home";
import list from "./list";
import permissions from "./permissions";
import recycle from "./recycle";

export default [...home, ...crud, ...list, ...permissions, ...recycle];
