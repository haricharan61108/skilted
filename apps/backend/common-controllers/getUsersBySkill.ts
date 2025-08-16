import { Request, Response } from "express";
import prisma from "db/client";



export const getUsersBySkill=async(req:Request,res:Response):Promise<void>=>{
    try {
        const {skill}=req.query;
        if(!skill) {
            res.status(400).json({msg:"Skill is required"});
            return;
        }

        const users=await prisma.userProfile.findMany({
            where: {
                skills: {
                    has:skill.toString(),
                },
            },
            select: {
                name:true,
                profilePicture:true,
                title:true
            },
        });

        if(users.length===0) {
           res.status(404).json({msg:"No users found with this skill"});
            return ;
        }
        res.json(users);
    } catch (error) {
        console.error('Error fetching users by skill',error);
        res.status(500).json({error:"Internal Server Error"});
    }
}


// GET /admin/users?page=1&limit=10
export const getUsersForAdmin=async(req:Request,res:Response):Promise<void>=>{
    try {
        const page=parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const users=await prisma.user.findMany({
            skip,
            take:limit,
            select: {
                id:true,
                email:true,
                profile: {
                    select :{
                        name:true,
                        profilePicture:true,
                        title:true,
                        skills:true,
                    },
                },
            },
        });

        const totalUsers=await prisma.user.count();
        res.status(200).json({
            success:true,
            page,
            limit,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const searchUsersForAdmin = async (req: Request, res: Response) => {
    try {
    const { q, page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const whereClause: any = q
    ? {
        OR: [
          { email: { contains: q as string, mode: "insensitive" } },
          { profile: { name: { contains: q as string, mode: "insensitive" } } },
          { profile: { title: { contains: q as string, mode: "insensitive" } } },
        ],
      }
    : {};

    const [users, totalUsers] = await Promise.all(
        [
            prisma.user.findMany({
                skip,
               take: pageSize,
               where: whereClause,
               include: {
               profile: true,
              },
            }),
            prisma.user.count({ where: whereClause }),
        ]);

        res.json({
            success: true,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(totalUsers / pageSize),
            totalUsers,
            users,
          });
    } catch (err) {
        console.error("Error searching users:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


