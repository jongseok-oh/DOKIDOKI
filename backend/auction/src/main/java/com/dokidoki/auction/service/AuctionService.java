package com.dokidoki.auction.service;

import com.dokidoki.auction.common.error.exception.InvalidValueException;
import com.dokidoki.auction.domain.entity.AuctionIngEntity;
import com.dokidoki.auction.domain.entity.CategoryEntity;
import com.dokidoki.auction.domain.entity.ProductEntity;
import com.dokidoki.auction.domain.repository.AuctionIngRepository;
import com.dokidoki.auction.domain.repository.CategoryRepository;
import com.dokidoki.auction.domain.repository.ProductRepository;
import com.dokidoki.auction.dto.request.AuctionRegisterReq;
import com.dokidoki.auction.dto.request.AuctionUpdateReq;
import com.dokidoki.auction.dto.response.CategoryResp;
import com.dokidoki.auction.dto.response.ProductResp;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuctionService {

    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    private final AuctionIngRepository auctionIngRepository;


    // 카테고리 목록 조회
    @Transactional
    public List<CategoryResp> getCategoryList() {
        List<CategoryEntity> categories = categoryRepository.findAll();
        List<CategoryResp> categoryList = new ArrayList<>();

        for (CategoryEntity categoryEntity : categories) {
            CategoryResp categoryResp = CategoryResp.builder()
                    .id(categoryEntity.getId())
                    .categoryName(categoryEntity.getCategoryName())
                    .build();

            categoryList.add(categoryResp);
        }

        return categoryList;
    }

    // 카테고리 기준 제품 목록 조회
    @Transactional
    public List<ProductResp> getProductList(Long catId) {
        List<ProductEntity> productEntities = productRepository.findByCategory_Id(catId);
        List<ProductResp> productList = new ArrayList<>();

        for (ProductEntity productEntity : productEntities) {
            ProductResp productResp = ProductResp.builder()
                    .productId(productEntity.getId())
                    .name(productEntity.getName())
                    .imgUrl(productEntity.getImgUrl())
                    .saleCnt(productEntity.getSaleCnt())
                    .build();
            productList.add(productResp);
        }

        return productList;
    }

    // 제품 등록시 판매 빈도 증가


    @Transactional
    public String createAuction(AuctionRegisterReq auctionRegisterReq, long sellerId) {
        Optional<ProductEntity> productO = productRepository.findById(auctionRegisterReq.getProductId());

        if (productO.isEmpty()) {
            return "제품에 대한 정보가 존재하지 않습니다.";
        }

        ProductEntity productEntity = productO.get();

        AuctionIngEntity auctionIngEntity = AuctionIngEntity.builder()
                .sellerId(sellerId)
                .productEntity(productEntity)
                .title(auctionRegisterReq.getTitle())
                .description(auctionRegisterReq.getDescription())
                .offerPrice(auctionRegisterReq.getOfferPrice())
                .priceSize(auctionRegisterReq.getPriceSize())
                .endAt(auctionRegisterReq.getEndAt())
                .meetingPlace(auctionRegisterReq.getMeetingPlace())
                .build();

        auctionIngRepository.save(auctionIngEntity);
        return "경매 게시글이 작성되었습니다.";
    }

    @Transactional
    public AuctionIngEntity updateAuction(long sellerId, long auctionId, AuctionUpdateReq auctionUpdateReq) throws Exception {

        Optional<AuctionIngEntity> auctionO = auctionIngRepository.findById(auctionId);
        AuctionIngEntity auction = auctionO.get();

        // 요청자와 판매자가 동일한 경우에만 update 수행
        if (auction.getSellerId() == sellerId)
            auction.update(auctionUpdateReq);
        return auction;
    }

    /**
     * 경매 id에 해당하는 진행중인 경매 정보 조회
     * @param   auctionId
     * @return 진행중인 경매 정보
     */
    @Transactional
    public AuctionIngEntity getAuctioningById(Long auctionId) {

        Optional<AuctionIngEntity> auctionO = auctionIngRepository.findById(auctionId);

        // 진행 중 경매 유무 체크
        if (auctionO.isEmpty()) {
            throw new InvalidValueException("진행중인 경매가 존재하지 않습니다.");
        }

        return auctionO.get();
    }
}
