import { listData } from "../Data";
import "./List.scss";
import Filter from "../components/filter/Filter";
import Card from "../components/card/Card";
import Map from "../components/map/Map";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import apiRequest from "../apiRequest";
import { fadeIn } from "../variants";
import { motion } from "framer-motion";

function ListPage() {
  const data = listData;
  const location = useLocation();

  // State for posts and query parameters
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    type: '',
    city: '',
    minPrice: 0,
    maxPrice: 100000000,
  });  

  // Extract query parameters from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type") || "buy";
    const city = searchParams.get("city") ||null;
    const property = searchParams.get("property") ||null;
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 100000000;
    const bedroom = Number(searchParams.get("bedroom")) || 1;

  // Update query state only if values have changed
    setQuery((prevQuery) => {
      if (
        prevQuery.type !== type ||
        prevQuery.city !== city ||
        prevQuery.minPrice !== minPrice ||
        prevQuery.maxPrice !== maxPrice ||
        prevQuery.bedroom !== bedroom ||
        prevQuery.property !== property
      ) {
        return { type, city, minPrice,property, maxPrice,bedroom };
      }
      return prevQuery;
    });
  }, [location.search]);

  // Fetch posts when the query changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log("Fetching posts with query:", query);
        const res = await apiRequest.post("/posts/getposts", query);
        console.log("Response:", res?.data?.posts);
        setPosts(res?.data?.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false)
    };

    // Fetch posts only if the query is populated
    if (query.type ) {
      console.log(query.type);
      
      fetchPosts();
    }
  }, [query]);
console.log(posts);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          {
            posts.length===0 ? (
              <div className="noPosts"><h2>No post found</h2></div>
            ) : (
              posts?.map((post,index) => (
                <motion.div
                  variants={fadeIn('left', 0.2)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{
                      once:false,
                      amount:0
                  }}>
                    <Card key={index} post={post} />
                </motion.div>
              ))
            )
          }
        </div>
      </div>
      <div className="mapContainer">
        <Map items={posts} />
      </div>
    </div>
  );
}

export default ListPage;
