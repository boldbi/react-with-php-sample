import React from 'react';
import '../index';
import {BoldBI} from '@boldbi/boldbi-embedded-sdk';

//PHP application will run on http://localhost:8080, which needs to be set as apiHost.
const apiHost = "http://localhost:8080";

//Url of the Authorization action in the PHP application.
const authorizationUrl = "/authorizeserver.php";

//Url of the GetDetails action in the PHP application.
const getDetailsURL = "/getData.php";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          toke: undefined,
          items: [],
          embedConfig: {},
        };
        this.BoldBiObj = new BoldBI();
      };

   renderDashboard(data) {
      this.dashboard= BoldBI.create({
        serverUrl: data.ServerUrl+"/" + data.SiteIdentifier,
        dashboardId: data.DashboardId,
        embedContainerId: "dashboard",
        embedType: data.EmbedType,
        environment: data.Environment,
        mode:BoldBI.Mode.View,
        width:"100%",
        height: window.innerHeight + 'px',
        expirationTime:100000,
        authorizationServer: {
            url: apiHost + authorizationUrl
        }
      });

      this.dashboard.loadDashboard();         
    }

  render() {
    return (
      <div id="Dashboard">
          <div id="viewer-section">
            <div id="dashboard"></div>
          </div>
      </div>
    );
  }

 async componentDidMount() {
    try {
        const response = await fetch(apiHost+getDetailsURL);
        const data = await response.json();
        this.setState({ embedConfig: data }, () => {
          const embedConfig = this.state.embedConfig;
          this.renderDashboard(embedConfig);
        });
      } catch (error) {
        console.log("Error in the embedConfig.json file");
        this.setState({ toke: "error", items: "error" });
      }
    }
}
export default Dashboard;