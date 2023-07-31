import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { updateGeneralParams } from "./redux/generalParamsSlice";
import { changeBodySize } from "./utils/utilsFuncs";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import Home from "./components/Home";
import Connect from "./components/Connect";
import NewDisc from "./components/NewDisc";
import Discography from "./components/Discography";
import Wantlist from "./components/Wantlist";

function App() {
  const generalParams = useAppSelector(state => state.generalParamsSlice);

  const dispatch = useAppDispatch();

  const showAlert = (message:string,type:string) => {
    const alertType = type ? type : '';
    dispatch(updateGeneralParams({alertMessage:message,alertVisible:true,alertType}));
    setTimeout(() => {
      dispatch(updateGeneralParams({alertVisible:false}));
    }, 2000);
  };

  useEffect(() => {
    window.addEventListener('resize', changeBodySize);
    changeBodySize();
  }, []);
  

  return (
    <div className="App">
      {generalParams.isLoading ? <div className="loader">
        <div className="loader__disc-container">
          <div className="loader__disc-inside">
            <div className="loader__disc"></div>
          </div>
          <div className="disc-shadow"></div>
        </div>
        <div className="loader__disc-container">
          <div className="loader__disc-inside">
            <div className="loader__disc"></div>
          </div>
          <div className="disc-shadow"></div>
        </div>
        <div className="loader__disc-container">
          <div className="loader__disc-inside">
            <div className="loader__disc"></div>
          </div>
          <div className="disc-shadow"></div>
        </div>
      </div> : <></>}
      {generalParams.alertVisible ? <div className="alert-window">
        <div className="alert-message-container">
          <div className={generalParams.alertType}></div>
          <p>{generalParams.alertMessage}</p>
        </div>
      </div> : <></>}
      <Routes>
        <Route path="/" element={<Home showAlert={showAlert}/>} />
        <Route path="/Connect" element={<Connect showAlert={showAlert}/>} />
        <Route path="/NewDisc" element={<NewDisc showAlert={showAlert}/>} />
        <Route path="/Discography" element={<Discography showAlert={showAlert}/>} />
        <Route path="/Wantlist" element={<Wantlist showAlert={showAlert}/>} />
      </Routes>
    </div>
  );
}

export default App;