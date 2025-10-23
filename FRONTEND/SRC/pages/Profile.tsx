import React, { useState } from "react";

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState({
    profileImage: "", // could be URL or base64
    userName: "John Doe",
    email: "john.doe@example.com",
    facebookAccount: "johns.fb.account",
    timeZone: "UTC+05:30",
    subscription: "Premium Plan",
    paymentInfo: "Visa **** 3456, Exp: 05/26",
    invoices: [
      { id: 1, date: "2025-10-01", amount: "$49.99" },
      { id: 2, date: "2025-09-01", amount: "$49.99" },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div >
      <div className="create-campaign">
        <h2 className="section-title">Profile</h2>

        <section>
          <h3>User Identification</h3>
          <div className="profile-section">
            <img
              className="profile-picture"
              src={profileData.profileImage || "/default-profile.png"}
              alt="User Profile"
            />

            <div className="form-group">
              <label htmlFor="userName">User Name</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={profileData.userName}
                onChange={handleInputChange}
                className="create-campaign-input"
                placeholder="Enter your user name"
                title="User Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="create-campaign-input"
                placeholder="Enter your email address"
                title="Email Address"
              />
            </div>
          </div>
        </section>

        <section>
          <h3>Account Details</h3>

          <div className="form-group">
            <label htmlFor="facebookAccount">Associated Facebook Account</label>
            <input
              type="text"
              id="facebookAccount"
              name="facebookAccount"
              value={profileData.facebookAccount}
              readOnly
              className="create-campaign-input"
              title="Associated Facebook Account"
              placeholder="Associated Facebook Account"
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeZone">Time Zone</label>
            <input
              type="text"
              id="timeZone"
              name="timeZone"
              value={profileData.timeZone}
              onChange={handleInputChange}
              className="create-campaign-input"
              placeholder="Enter your time zone"
              title="Time Zone"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subscription">Subscription</label>
            <input
              type="text"
              id="subscription"
              name="subscription"
              value={profileData.subscription}
              readOnly
              className="create-campaign-input"
              title="Subscription"
              placeholder="Subscription plan"
            />
          </div>
        </section>

        <section>
          <h3>Billing Information</h3>

          <div className="form-group">
            <label htmlFor="paymentInfo">Payment Information</label>
            <input
              type="text"
              id="paymentInfo"
              name="paymentInfo"
              value={profileData.paymentInfo}
              readOnly
              className="create-campaign-input"
              title="Payment Information"
              placeholder="Payment information"
            />
          </div>

          <div>
            <label>Invoices / Transaction History</label>
            <ul className="invoices-list" aria-label="Invoices and Transaction History">
              {profileData.invoices.map((invoice) => (
                <li key={invoice.id}>
                  {invoice.date}: {invoice.amount}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
