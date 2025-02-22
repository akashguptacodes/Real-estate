import './list.scss'
import Card from"../card/Card"
import { motion } from 'framer-motion'
import { fadeIn } from '../../variants'

function List({myposts,mysavedposts}){
  return (
    <div className='list'>
      {
        myposts?(
          myposts?.map((post)=>(
            <motion.div
            variants={fadeIn('left', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{
                once:false,
                amount:0
            }}
            key={post?._id}
            className='cards'>
              <Card post={post}></Card>
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
            }}
            key={post?._id}>
              <Card post={post?.postId}></Card>
            </motion.div>
          ))
        )
      }
    </div>
  )
}
export default List