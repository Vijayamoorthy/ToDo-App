const db=require("../databases/sqlite");
const userdb=db.users;
const listdb=db.lists;

exports.signin=async(req,res)=>{
   await res.render("sign-in");
}

exports.signup=async(req,res)=>{
   await res.render("signup");
}

// exports.Profile=async(req,res)=>{
//     const name=req.session.name;
//     await res.render("profile",{name});
// }

exports.Profile = async(req, res) => {
  const user_id =req.session.userId;
  const name =req.session.name;
  console.log("req.session.name: ", name);
  console.log("req.session.userId: ", user_id);
  
  const todos=await listdb
    .findAll({ where: { user_id: user_id } })
    .then(todos => {
      console.log("Showing all todos :" + todos);
      return res.render("profile", { todos ,name});
    })
    .catch(err => {
      console.log("Error Occured! :" + err);
    });
};

exports.redirectprofile=(req,res,next)=>{
    if(req.session.userId){
        res.redirect("/")
    }else{
        next()
    }
}


exports.loginPost=async(req,res)=>{
    const {email,password}=req.body;
    if(email&&password){
        try{
        const user=await userdb.findOne({where:{email: email}}&&{where:{password: password}})
        console.log("user.id: ",user.id);
        if(user){
             req.session.userId=user.id;
             req.session.name=user.name;
             req.session.email=user.email;
             const id=user.id;
             return res.redirect("/")
        }
    }catch{
        console.log("No such user exists...");
    }
    }
    res.redirect("/signin");
}

exports.registerPost=async(req,res)=>{
    const {name,email,password}=req.body
    console.log("req.body: ",req.body);
    //userdb.create(req.body)
    console.log("userdb: ",userdb);
    if(name&&email&&password)
    {
        const exist=await userdb.findOne({where:{email:email}})
        console.log("exist: ",exist);
         
        if(exist===null)
        {
            
            await userdb.create(req.body).then(()=>{
            console.log("New Data Added.. Database updated.. ")}
            ).catch(err=>{console.log(err);})
            const user= await userdb.findOne({where:{email:email}})      
            req.session.userId=user.id;      
            req.session.name=user.name; 
            req.session.email=user.email;
            console.log("user.name: ",req.session.name);
            return res.redirect("/");
            
        }else
        {
            console.log("please enter the input fields...");
        }
    res.redirect("/signin")
}   
}

exports.redirectlogin=(req,res,next)=>{
    if(!req.session.userId){
        res.redirect("/signin")
    }else{
        next()
    }
}

exports.logoutPost=async(req,res)=>{
     await req.session.destroy(err=>{
     if(err){ return res.redirect("/") }
 //    console.log("sess_name",SESS_NAME);
        res.clearCookie("todo")
        res.redirect("/signin")
    })
}

exports.addtodo=async(req,res)=>{
    const {item}=req.body;
    const user_id=req.session.userId
    try{
        await listdb.create({item,user_id,edit:false,done:"yes"})
        console.log("Task added...");
        console.log("req.session.userId: ",user_id);
        return res.redirect("/");
    }
    catch{
        console.log("Task not added...");
    }
}

exports.editbar=async(req,res)=>{
    const {id}=req.body;
    console.log("id: ",id);
    try{
        await listdb.update({edit:true},{where:{id:id}});
        console.log("Edit value updated to true.. Edit the required Todo..");
        return res.redirect("/");
    }catch{
        console.log("Some error.. editbar function doesn't work..");
    }
}

exports.deltodo=async(req,res)=>{
    const {id}=req.body;
    try{
    await listdb.destroy({where:{id:id}});
    console.log("Todo Deleted...");
    return res.redirect("/");
    }
    catch{
        console.log("Cannot be deleted, some error occurs..");
    }
}

exports.editdata=async(req,res)=>{
    const {id,item}=req.body;
    try{
    await listdb.update({edit:false,item:item},{where:{id:id}});
    console.log("Data updated successfully...");
    return res.redirect("/")
    }catch{
        console.log("Data not updated...");
    }
}
exports.donetodo=async(req,res)=>{
    const {id}=req.body;
    try{
    await listdb.update({done:"completed"},{where:{id:id}});
    console.log("Task completed...");
    return res.redirect("/");
    }
    catch{
        console.log("Task completion not accomplished...");
    }
}