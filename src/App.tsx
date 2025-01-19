import "./App.css";
import styles from "./App.module.css";
import { AppHeader } from "./components/app-header";
// подгружаем common.css из библиотеки ЯП - эти стили применяются к root, header и т.д.
// например, библиотека делает весь фон черным и меняет скроллы
import "@ya.praktikum/react-developer-burger-ui-components";
import { LeftRight } from "./components/left-right";

function App() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <LeftRight className={styles.leftRight} />
    </div>
  );
}

export default App;
