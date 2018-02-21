import { h, Component, Fragment } from "preact";
import "./styles.scss";

const ImagePost = props => (
  <Fragment>
    {props.photos.map(item => (
      <div className="photo-single">
        <img
          style={{
            height:
              item.original_size.height *
              window.outerWidth /
              item.original_size.width
          }}
          src={item.original_size.url}
        />
      </div>
    ))}
  </Fragment>
);

class HTML extends Component {
  componentDidMount() {
    this.base.innerHTML = this.props.html;
  }
  render() {
    return <div className="caption-container" />;
  }
}

const PostSwitch = props => {
  switch (props.type) {
    case "photo": {
      return <ImagePost {...props} />;
    }
    case "text": {
      return <HTML html={props.body} />;
    }
    default: {
      return <div>Type of post: {props.type}</div>;
    }
  }
};

class Engage extends Component {
  toggleLike() {
    alert("Like not complete.");
  }
  toggleReblog() {
    alert("Reblog not complete.");
  }
  render() {
    return (
      <div className="engage-container">
        <div className="notes">{this.props.note_count} notes</div>
        <div className="actions">
          {this.props.can_like && (
            <img
              onClick={this.toggleLike.bind(this)}
              src={require("../../assets/heart.svg")}
            />
          )}
          {this.props.can_reblog && (
            <img
              onClick={this.toggleReblog.bind(this)}
              src={require("../../assets/bookmark.svg")}
            />
          )}
        </div>
      </div>
    );
  }
}

const BlogIntro = props => (
  <div className="blog-intro">
    <div>{props.blog_name}</div>
  </div>
);

export default props => (
  <div className="list-post-container">
    <BlogIntro {...props} />
    <PostSwitch {...props} />
    {props.caption && <HTML html={props.caption} />}
    {props.can_like && props.can_reblog && <Engage {...props} />}
  </div>
);

//   id,
//   type,
//   blog_name,
//   reblog_key,
//   body,
//   can_like,
//   can_reblog,
//   can_reply,
//   can_send_in_message,
//   caption,
//   date,
//   display_avatar,
//   followed,
//   format,
//   highlighted,
//   liked,
//   note_count,
//   post_url,
//   reblog,
//   recommended_color,
//   recommended_source,
//   short_url,
//   slug,
//   source_title,
//   source_url,
//   state,
//   summary,
//   tags,
//   timestamp,
//   trail,
//   html5_capable,
//   permalink_url,
//   player,
//   thumbnail_height,
//   thumbnail_url,
//   thumbnail_width,
//   video,
//   video_type,
//   children
