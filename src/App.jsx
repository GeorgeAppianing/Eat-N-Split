import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, SetFriends] = useState(initialFriends);
  const [toggleForm, setToggleForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    SetFriends((prevFriends) => [...prevFriends, friend]);
  }

  function handleSelectedFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setToggleForm(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    SetFriends((friends) =>
      friends.map((friend) =>
        selectedFriend?.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelectedFriend={handleSelectedFriend}
          setSelectedFriend={setSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {toggleForm && (
          <FormAddFriend
            handleAddFriend={handleAddFriend}
            setToggleForm={setToggleForm}
          />
        )}
        <Button onClick={() => setToggleForm(!toggleForm)}>
          {toggleForm ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({
  friends,
  handleSelectedFriend,
  setSelectedFriend,
  selectedFriend,
}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          handleSelectedFriend={handleSelectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({
  friend,
  handleSelectedFriend,
  // setSelectedFriend,
  selectedFriend,
}) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : "close"}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <Button onClick={() => handleSelectedFriend(friend)}>
        {selectedFriend?.id === friend.id ? "Close " : "Select"}
      </Button>
      {/* <Button onClick={() => setSelectedFriend(friend)}>
        {selectedFriend?.id === friend.id ? "Close" : "Select"}
      </Button> */}
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ handleAddFriend, setToggleForm }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?${id}`,
      balance: 0,
    };
    handleAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
    setToggleForm(false);
  }
  return (
    <form onSubmit={handleSubmit} className="form-add-friend">
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="">Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("User");
  const paidByFriend = bill ? bill - paidByUser : 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
    setBill("");
    setPaidByUser("");
  }
  return (
    <form onSubmit={handleSubmit} className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label htmlFor="">{selectedFriend.name} value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label htmlFor="">Your expence</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => setPaidByUser(Number(e.target.value))}
      />
      <label htmlFor="">{selectedFriend.name}'s bill</label>
      <input type="text" disabled value={paidByFriend} />

      <label htmlFor="">Who is paying the bill</label>
      <select
        name=""
        id=""
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
export default App;
