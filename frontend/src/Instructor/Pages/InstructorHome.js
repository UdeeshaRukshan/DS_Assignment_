import React, { useState } from 'react';
import { Layout, Menu, message } from 'antd';
import {
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    BookOutlined, PlusCircleOutlined,
} from '@ant-design/icons';
import InstructorAllCourses from "./InstructorAllCourses";
import InstructorProfile from "./InstructorProfile";
import {useNavigate} from "react-router-dom";
import AddNewCourse from "../Components/AddNewCourse";
import { Image } from "react-bootstrap";

const { Header, Sider, Content } = Layout;

const InstructorHome = ({ collapsed, onCollapse, onSelectMenuItem }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('instructorId');
        message.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ left: 0 }}
            className="custom-sider"
        >
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                onSelect={onSelectMenuItem}
            ><hr style={{marginTop:'1%', color:'transparent'}} />
                <Menu.Item style={{
              marginRight: "20px",
              fontSize: "24px",
              className:"flex"
            }} icon={<Image src="../Design.png" alt="Home Page Image"  fluid style={{ width: '30%', height: '90%' }}/>} key="5">
                
                    SkillHub</Menu.Item>
                    <hr style={{marginTop:'3%', color:'white'}} />
                <Menu.Item key="1" icon={<BookOutlined />}>
                    All Courses
                </Menu.Item>
                <Menu.Item key="2" icon={<PlusCircleOutlined />}>
                    Add Course
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />}>
                    Profile
                </Menu.Item>
                <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <hr style={{marginTop:'180%', color:'white'}} />
                <Menu.Item key="4" icon={<LogoutOutlined style={{color:"orangered"}} />} onClick={handleLogout}>
                    Logout
                </Menu.Item>
                </div>
                
            </Menu>
        </Sider>
    );
};

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const handleSelectMenuItem = ({ item, key }) => {
        setSelectedMenuItem(key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <InstructorHome
                collapsed={collapsed}
                onSelectMenuItem={handleSelectMenuItem}
            />
            <Layout>
            <Header style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        type="button"
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            color: 'white'
                        }}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>

                    <button
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                        type="button"
                    >
                        <BellOutlined style={{fontWeight:'bold', fontSize:'20px'}} />
                    </button>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    {selectedMenuItem === '1' && <InstructorAllCourses />}
                    {selectedMenuItem === '2' && <AddNewCourse />}
                    {selectedMenuItem === '3' && <InstructorProfile />}
                    {selectedMenuItem === '5' && <InstructorAllCourses />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
