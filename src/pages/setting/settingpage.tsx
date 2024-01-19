import * as React from 'react';
import ThemeToggle from './darktheme';
import { optStore, userIdStore } from '../../store/store';
import { GetSetting, PutSetting } from './SettingAPI';
import ChangeProfileModal from '../../components/ChangeProfileModal';
type SettingItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
  iconSrc: string;
};

function SettingItem({ children, onClick, iconSrc }: SettingItemProps) {
  return (
    <div
      onClick={onClick}
      className="w-[48%] justify-evenly flex flex-col mb-4 px-2 items-center text-gray-700 cursor-pointer text-[1.2rem] rounded-xl shadow-md shadow-[#77A5FF] bg-white hover:bg-cliptab-blue"
    >
      <img src={iconSrc} alt="Icon" className="" style={{ width: '20px', height: '20px' }} />
      <p className="text-sm text-cliptab-blue font-bold">{children}</p>
    </div>
  );
}
function Dropdown({ onSelect, options }) {
  return (
    <div className="flex flex-col bg-gray-100 shadow-md rounded-md mt-2">
      {options.map((option, index) => (
        <div key={index} onClick={() => onSelect(option)} className="px-4 py-2 hover:bg-blue-200 cursor-pointer">
          {option}
        </div>
      ))}
    </div>
  );
}

export default function SettingPage() {
  const [currentDropdown, setCurrentDropdown] = React.useState(null);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const { userId, userName, userEmail } = userIdStore();
  const { opt_sum, opt_start, opt_theme, opt_alarm, toggleOptSum, toggleOptStart, toggleOptTheme, toggleOptAlarm } =
    optStore();
  const [isChangeProfileOpen, setIsChangeProfileOpen] = React.useState(false);

  //유저아이디 or 설정 정보가 업데이트 될때마다 설정정보 조회
  React.useEffect(() => {
    GetSetting(userId);
  }, [userId, opt_sum, opt_start, opt_theme, opt_alarm]);

  const handleDropdownSelect = (option) => {
    console.log(`${option} 선택됨`);
    setCurrentDropdown(null);
  };
  const dropdownOptions = {
    summary: ['3줄 요약', '6줄 요약'],
    changeStartPage: ['북마크 페이지', '클립보드 페이지'],
    bookmarkNotif: ['20일', '30일', '50일'],
  };
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    const htmlEl = document.querySelector('html');
    if (!htmlEl) return;
    const enabledDarkMode = htmlEl.classList.contains('dark');
    if (isDarkTheme) {
      // 다크모드인 경우(html 태그의 className에 dark가 있을때)
      // -> className에서 dark를 제거
      htmlEl.classList.remove('dark');
    } else {
      // 다크모드가 아닌 경우, className에서 dark를 추가
      htmlEl.classList.add('dark');
    }
  };

  const openChangeProfileModal = () => {
    setIsChangeProfileOpen(true);
  };

  const closeChangeProfileModal = () => {
    setIsChangeProfileOpen(false);
  };

  const icons = {
    summary: 'https://i.ibb.co/s1tpM8f/free-icon-open-book-167755.png',
    changeStartPage: 'https://i.ibb.co/R6kYBpq/free-icon-page-layout-4548040.png',
    darkTheme: 'https://i.ibb.co/mNXCmNb/free-icon-night-2007907.png',
    lightTheme: 'https://i.ibb.co/mGwtxDj/free-icon-sun-5497432.png',
    bookmarkNotif: 'https://i.ibb.co/BNZH1V4/free-icon-notification-bell-9437878.png',
  };
  return (
    <div className={`flex flex-col items-center h-screen px-5 ${isDarkTheme ? 'dark' : ''}`}>
      <img src="https://i.ibb.co/kGjjkfk/Frame-427318914.png" alt="logo_icon" className="mt-10 mb-10 w-28 h-auto" />
      <p className="text-gray-500 self-start py-2">My Account</p>
      <div className="w-full bg-white rounded-[15px] shadow-md shadow-[#77A5FF] flex flex-row itmes-center mb-12 py-4 px-2">
        <img className="size-11 rounded-full mx-4 my-1" src="https://i.ibb.co/RpBHbh3/8-2.png" />
        <div className="flex flex-col">
          <p className="w-full text-gray-950 font-semibold my-1">{userName}</p>
          <p className="w-full text-gray-500 text-sm">{userEmail}</p>
        </div>
        <button
          onClick={() => {
            openChangeProfileModal();
          }}
        >
          수정버튼
        </button>
      </div>
      <p className="text-gray-500 self-start py-3">Settings</p>
      <div className={`flex w-full h-[31rem] ${isDarkTheme ? 'bg-gray-800' : 'bg-transparent'}`}>
        <div className="flex flex-row text-center flex-wrap justify-between">
          <SettingItem
            iconSrc={icons.summary}
            onClick={() => {
              // handleItemClick('summary')
              toggleOptSum();
              PutSetting(userId, opt_sum, opt_start, opt_theme, opt_alarm);
            }}
          >
            요약 설정
            <p className={` ${opt_sum ? '클래스1' : ' text-[#747ED9]'} text-lg mt-4 `}>
              {opt_sum ? '3줄 요약' : '6줄 요약'}
            </p>
          </SettingItem>
          {currentDropdown === 'summary' && (
            <Dropdown onSelect={handleDropdownSelect} options={dropdownOptions.summary} />
          )}
          <SettingItem
            iconSrc={icons.changeStartPage}
            onClick={() => {
              //handleItemClick('changeStartPage')
              toggleOptStart();
              PutSetting(userId, opt_sum, opt_start, opt_theme, opt_alarm);
            }}
          >
            시작 페이지 변경
            <p className={` ${opt_start ? '클래스1' : ' text-[#747ED9]'} text-lg mt-4 `}>
              {opt_start ? '북마크' : '이미지 클립'}
            </p>
          </SettingItem>
          {currentDropdown === 'changeStartPage' && (
            <Dropdown onSelect={handleDropdownSelect} options={dropdownOptions.changeStartPage} />
          )}
          <ThemeToggle />
          <SettingItem
            iconSrc={icons.bookmarkNotif}
            onClick={() => {
              //handleItemClick('bookmarkNotif')
              toggleOptAlarm();
              PutSetting(userId, opt_sum, opt_start, opt_theme, opt_alarm);
            }}
          >
            북마크 알림 주기
            <p className={` ${opt_alarm ? '클래스1' : ' text-[#747ED9]'} text-lg mt-4 `}>
              {opt_alarm ? '15일' : '30일'}
            </p>
          </SettingItem>
          {currentDropdown === 'bookmarkNotif' && (
            <Dropdown onSelect={handleDropdownSelect} options={dropdownOptions.bookmarkNotif} />
          )}
        </div>
        <ChangeProfileModal isOpen={isChangeProfileOpen} onClose={closeChangeProfileModal} />
      </div>
    </div>
  );
}
