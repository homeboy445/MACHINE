import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import Download_Icon from "../../assets/icons/download.svg";

const ShareResultPage = () => {
  const [query, updateQuery] = useState([
    {
      name: "",
      result: null,
      resultTab: false,
      is_error: {
        status: false,
        message: "Something's wrong. Try again later.",
      },
      download_data: {},
    },
  ]);
  const [downloadBar, toggleDownloadBar] = useState({
    0: -1,
    status: false,
  });

  const getDownloadLink = (data, contentType = "application/json") => {
      return null;
    let main_Data = null;
    if (JSON.stringify(data) === JSON.stringify({})) {
      return data;
    }
    if (contentType === "application/json") {
      main_Data = JSON.stringify(data);
    } else {
      const keys = Object.keys(data[0]);
      main_Data = keys.join(",") + "\n";
      data.map((item) => {
        for (let i = 0; i < keys.length; i++) {
          main_Data += item[keys[i]];
          if (i !== keys.length - 1) {
            main_Data += ",";
          }
        }
        main_Data += "\n";
        return null;
      });
    }
    const blob = new Blob([main_Data], { type: contentType });
    return window.URL.createObjectURL(blob);
  };

  useEffect(()=>{
    console.log(window.location.pathname);
  },[]);

  return (
    <div>
      <div className="site_header">
        <div className="site_header_sub">
          <h1 className="site_title">MACHINE.</h1>
          <h3>sql editor</h3>
        </div>
      </div>
      <div className="query_list">
        <div className="query_box">
          <div className="query_edit">
            <p>[1]: </p>
            <input
              type="text"
              spellCheck="false"
              className="quert_input"
              disabled={true}
            />
            <div className="download_options">
              <img
                data-tip="download"
                src={Download_Icon}
                alt=""
                id="query_icon3"
                onClick={() => {
                  toggleDownloadBar(!downloadBar);
                }}
              />
              <ReactTooltip />
              <ul
                style={{
                  opacity:
                    downloadBar &&
                    JSON.stringify(query.download_data) !== JSON.stringify({})
                      ? 1
                      : 0,
                  marginLeft:
                    downloadBar &&
                    JSON.stringify(query.download_data) !== JSON.stringify({})
                      ? "1%"
                      : "-10%",
                  pointerEvents:
                    downloadBar &&
                    JSON.stringify(query.download_data) !== JSON.stringify({})
                      ? "all"
                      : "none",
                }}
              >
                <li>
                  <a
                    href={getDownloadLink(query.download_data, "text/csv")}
                    download={`${0 + 1}.csv`}
                    style={{
                      color: "grey",
                      textDecoration: "none",
                    }}
                  >
                    As CSV
                  </a>
                </li>
                <li>
                  <a
                    href={getDownloadLink(query.download_data)}
                    download={`${0 + 1}.json`}
                    style={{
                      color: "grey",
                      textDecoration: "none",
                    }}
                  >
                    As JSON
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="query_result_parent">
            <div
              className="query_result"
              style={{
                height: query.resultTab
                  ? query.is_error.status
                    ? "80px"
                    : "400px"
                  : "1px",
                visibility: query.resultTab === true ? "visible" : "hidden",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareResultPage;
