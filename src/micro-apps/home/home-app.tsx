import { Route } from "react-router-dom";
import { HomePage } from "./home";
import './home-app.css';
import { v_map } from "../../components/v-layout/v-layout";
import { MicroApp, RouteItem } from "../../components/v-common/v-app";

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
      </>
    );
  }
}

export const homeApp: HomeApp = new HomeApp();