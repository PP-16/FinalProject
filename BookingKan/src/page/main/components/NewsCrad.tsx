import React, { useState } from "react";
import "./NewsCrad.css";
import { Card, Col, Modal, Row } from "antd";
import { useAppSelector } from "../../../api/redux/Store/configureStore";
import { PathImage } from "../../../routers/PathImage";
import moment from "moment";

export const NewsCrad = ({openDetails, dataDetails}:any) => {
  const news = useAppSelector((t) => t.news.news);

  const handleOnclick = (newsItem: any) => {
    openDetails(true);
    dataDetails(newsItem);
  };

  return (
    <>
      <Row gutter={{ xs: 6, sm: 8, md: 16, lg: 32 }}>
        {news.map((newsItem: any) => {
          const img = PathImage.imageNews + newsItem.imageNews[0].images;
          return (
            <Col
              xs={24}
              sm={24}
              md={12}
              xl={6}
              xxl={6}
              style={{marginTop:10}}
              onClick={() => handleOnclick(newsItem)}
            >
              <article className="card">
                <img
                  className="card__background"
                  src={img}
                  alt="Photo of Cartagena's cathedral at the background and some colonial style houses"
                  width="100%"
                  height="250"
                />
                <div className="card__content | flow">
                  <div className="card__content--container | flow">
                    <h2 className="card__title">{newsItem.newsName}</h2>
                    <p className="card__description">{newsItem.newsDetails}</p>
                    <p className="card__description">
                      {moment(newsItem.createAt).format("ll")}
                    </p>
                  </div>
                  {/* <button className="card__button">{newsItem.createAt}</button> */}
                </div>
              </article>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
