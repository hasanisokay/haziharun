'use client'
import { Button } from "@/components/ui/button"
import { toggleTheme } from "@/store/slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";
const Home = () => {
const  user = useSelector(state=>state.user.userData);
const  theme = useSelector(state=>state.theme.mode);
const dispatch = useDispatch()
console.log(user, theme)    
return (
        <div className="p-10 min-h-screen" >
            <Button onClick={()=>dispatch(setUserData({name:"HHH"}))} >Click ++</Button>
            <Button onClick={()=>dispatch(toggleTheme())}>Click ---</Button>

            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                People stopped telling jokes
            </h4>
        </div>
    );
};

export default Home;