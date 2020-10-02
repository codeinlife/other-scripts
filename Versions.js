import React, { Component } from 'react';
import SoftwareComponent from './SoftwareComponent';
import '~assets/styles/versions.css';
import Loader from 'react-loader-spinner';
import { chronos } from '~js/chronosManager';

class Versions extends Component {
    constructor() {
        super();
        this.state = { versionData: [] };
    }

    async componentDidMount() {
        const versionData = await chronos.get('/api/dashboard/versions');
        this.setState({ versionData: versionData[1].data });
    }

    renderSoftwareComponents = versionData => {
        return versionData.map((a, i) => {
            const { env, data } = a;
            const { version, files } = data;
            if (i === versionData.length - 1) {
                return (
                    <div key={i} className="content-container">
                        <SoftwareComponent env={env} version={version} files={files} />
                    </div>
                );
            }
            return (
                <div key={i} className="content-container">
                    <SoftwareComponent env={env} version={version} files={files} />
                    <div className="line"></div>
                </div>
            );
        });
    };

    render() {
        const { versionData } = this.state;

        if (versionData.length == 0) {
            return (
                <div style={{ position: 'absolute', left: '45%', marginTop: '10%' }}>
                    <Loader type="Oval" color="#fc0303" height={100} width={100} />
                </div>
            );
        }
        return (
            <div className="version-container">
                <h1 style={{ marginLeft: '4%' }}>Order-Inquiry</h1>
                <div className="component-container">
                    {this.renderSoftwareComponents(versionData)}
                </div>
            </div>
        );
    }
}

export default Versions;
