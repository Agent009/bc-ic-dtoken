import React from 'react';
import log from 'loglevel';
// import remote from 'loglevel-plugin-remote';

// const customJSON = log => ({msg: log.message, level: log.level.label, stacktrace: log.stacktrace});
// remote.apply(log, { format: customJSON, url: '/logger' });
log.enableAll();

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        log.error({error, errorInfo});
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}
