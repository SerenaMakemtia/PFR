import React, { useState } from "react";
import PropTypes from "prop-types";

const Tabs = ({ children, defaultActiveTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Filter out non-Tab children
  const tabs = React.Children.toArray(children).filter(
    (child) => child.type && child.type.displayName === "Tab"
  );

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab] ? tabs[activeTab].props.children : null}
      </div>
      <style jsx>{`
        .tabs-container {
          width: 100%;
          margin-bottom: 1rem;
        }
        .tabs-header {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 1rem;
        }
        .tab-button {
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          font-size: 1rem;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }
        .tab-button:hover {
          color: #3182ce;
        }
        .tab-button.active {
          color: #3182ce;
          font-weight: 600;
        }
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #3182ce;
        }
        .tab-content {
          padding: 1rem 0;
        }
      `}</style>
    </div>
  );
};

const Tab = ({ children, label }) => {
  return <div>{children}</div>;
};

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

Tab.displayName = "Tab";

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultActiveTab: PropTypes.number,
};

export { Tabs, Tab };