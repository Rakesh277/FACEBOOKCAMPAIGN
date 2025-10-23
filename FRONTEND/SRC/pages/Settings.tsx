import React, { useState } from "react";

const Settings: React.FC = () => {
  const [formData, setFormData] = useState({
    theme: "dark",
    language: "en",
    defaultCurrency: "USD",
    facebookAccounts: ["your-facebook-id"], // example connected Facebook accounts
    apiKey: "",
    password: "",
    twoFactorAuthEnabled: false,
    activeSessions: ["Device 1", "Device 2"], // example active sessions list
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;

    let value: string | boolean;
    if (target.type === "checkbox" && "checked" in target) {
      value = (target as HTMLInputElement).checked;
    } else {
      value = target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully!");
    console.log("Saved settings:", formData);
  };

  return (
    <div >
      <div className="create-campaign">
        <h2 className="section-title">Settings</h2>

        <form onSubmit={handleSubmit} className="create-campaign-form">
          {/* Preferences */}
          <h3>Preferences</h3>
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="create-campaign-select"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="create-campaign-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              {/* Add more languages */}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="defaultCurrency">Default Currency</label>
            <select
              id="defaultCurrency"
              name="defaultCurrency"
              value={formData.defaultCurrency}
              onChange={handleChange}
              className="create-campaign-select"
            >
              <option value="INR">INR - INDIAN Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              {/* Add more currencies */}
            </select>
          </div>

          {/* Integration Access */}
          <h3>Integration Access</h3>

          <div className="form-group">
            <label>Connected Facebook Accounts</label>
            <ul>
              {formData.facebookAccounts.map((account, idx) => (
                <li key={idx}>{account}</li>
              ))}
            </ul>
            {/* Here you may add UI for removing/adding accounts */}
          </div>

          <div className="form-group">
            <label htmlFor="apiKey">API Key</label>
            <input
              id="apiKey"
              name="apiKey"
              type="text"
              value={formData.apiKey}
              onChange={handleChange}
              className="create-campaign-input"
              placeholder="Enter API Key"
            />
          </div>

          {/* Security & Privacy */}
          <h3>Security & Privacy</h3>

          <div className="form-group">
            <label htmlFor="password">Change Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              className="create-campaign-input"
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="twoFactorAuthEnabled">Two Factor Authentication </label>
            <input
              id="twoFactorAuthEnabled"
              name="twoFactorAuthEnabled"
              type="checkbox"
              checked={formData.twoFactorAuthEnabled}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Active Sessions</label>
            <ul>
              {formData.activeSessions.map((session, idx) => (
                <li key={idx}>{session}</li>
              ))}
            </ul>
            {/* Add UI for managing sessions, e.g., logout from session */}
          </div>

          <div className="submit-container">
            <button className="create-campaign-submit" type="submit">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
