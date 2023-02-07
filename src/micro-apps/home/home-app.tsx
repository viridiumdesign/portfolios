import { Route } from "react-router-dom";
import { HomePage } from "./home";
import './home-app.css';
import { v_map } from "../../components/v-layout/v-layout";
import { MicroApp, RouteItem } from "../../components/v-common/v-app";
import { About } from "./about";

class HomeApp extends MicroApp {
  getTitle = (): string => {
    return "Home";
  }
  public getName = () => {
    return "home-app";
  }

  public getIcon = () => {
    return "luckie.png";
  }

  private routeItems: Array<RouteItem> = [
    new RouteItem().init("Work", "About", "2", "/home-app/work"),
    new RouteItem().init("About", "About", "2", "/home-app/about")
  ];
  public getRouteItems = () => {
    return this.routeItems;
  }

  public getNavItems = () => {
    return [];
  }

  public getRoutes = () => {

    return (
      <>
        <Route path={v_map("/")} element={<HomePage />} />
        <Route path={v_map("/home-app")} element={<HomePage />} />
        <Route path={v_map("/home-app/projects")} element={<HomePage />} />
        <Route path={v_map("/home-app/about")} element={<About />} />
      </>
    );
  }
}

export const homeApp: HomeApp = new HomeApp();