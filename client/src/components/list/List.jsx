import './list.scss'
import Card from"../card/Card"
import { motion } from 'framer-motion'
import { fadeIn } from '../../variants'

function List({myposts,mysavedposts}){
  return (
    <div>
      {
        myposts?(
          myposts?.map(post=>(
            <motion.div
            variants={fadeIn('left', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{
                once:false,
                amount:0
            }}>
              <Card key={post?._id} post={post}></Card>
            </motion.div>
          ))
        ):(
          mysavedposts?.map(post=>(
            <motion.div
            variants={fadeIn('left', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{
                once:false,
                amount:0
            }}>
              <Card key={post?._id} post={post?.postId}></Card>
            </motion.div>
          ))
        )
      }
    </div>
  )
}
export default List