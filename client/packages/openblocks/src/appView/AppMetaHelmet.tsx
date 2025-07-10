import React from "react";
import { Helmet } from "react-helmet";

interface AppMetaHelmetProps {
    appIconUrl?: string;
    appId?: string;
}

const AppMetaHelmet: React.FC<AppMetaHelmetProps> = ({ appIconUrl, appId }) => (
    <Helmet>
        {appIconUrl && [
            <link rel="icon" href={appIconUrl} />,
            <link rel="shortcut icon" href={appIconUrl} />,
        ]}
        {appId && (
            <link rel="manifest" href={`/api/pbl/applications/manifest?slug=${appId}`} />
        )}
    </Helmet>
);

export default AppMetaHelmet; 