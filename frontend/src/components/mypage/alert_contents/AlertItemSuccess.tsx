import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { noticeAPI } from 'src/api/axios';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';


const StyledBlueSpan = styled.span`
  color: #3a77ee;
  cursor: pointer;
`;

const StyledRedSpan = styled.span`
  color: #ff3333;
`;

function numberFormat(price: number | null) {
  return price?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') + ' 원';
}

type SuccessAlert = {
  type: string;
  product_id: number;
  product_name: string;
  auction_id: number;
  final_price: number;
  time_stamp: string;
  read: boolean;
}

type AlertData = {
  type: string; // "PURCHASE_SUCCESS", "PURCHASE_FAIL", "SALE_COMPLETE", "OUTBID"
  product_id: number;
  product_name : string;
  auction_id : number;
  final_price : number;
  my_final_price : number;
  current_bid_price : number;
  time_stamp : string;
  price: number;
  // title: string;
  // id: number;
  read: boolean;
};


const AlertItemSuccess: React.FC<{
  data: AlertData;
  key: string;
  id: string;
  setAlertMap: (data: any) => void;
  setAlertCnt: (data: any) => void;
}> = (props) => {
  const navigate = useNavigate();

  // 안쓰는
  //   function deletHelder(id: number) {
  //    props.setAlertList((pre:AlertData[]) => pre.filter((data:AlertData) => (data.id !== id)))
  //   }

  function ComponentHidden(key: any) {
    props.setAlertMap((pre: any) => {
      const updateAlertMap = {...pre};
      updateAlertMap[key].read = true;
      Read(key)
      return updateAlertMap;
    });
  }

  function visibleStyle(x: boolean) {
    if (x) {
      return {
        opacity: 1,
        mb: 4,
        padding: '20px',
        paddingLeft: '0px',
        height:"130px"
      };
    } else {
      return {
        opacity: 0,
        height: 0,
      };
    }
  }

  function Read(key: string) {
    noticeAPI.put(
      `/${key}/read`
    ).then((res)=> {
      // console.log(res)
    })
  }

  return (
    <Paper
      elevation={3}
      sx={{ width: '90%', boxSizing: 'border-box',transition:"1s",borderLeft: '15px solid #3A77EE', ...visibleStyle(!props.data.read) }}
      
    >
      <Typography variant="subtitle1">
        <Grid container>
        <Grid
            item
            xs={2}
            sx={{
              color: '#3A77EE',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <GavelOutlinedIcon  fontSize="large" />
          </Grid>
          <Grid item xs>
          <span style={{ color: '#3A77EE', fontSize: '20px', fontWeight:"bold"}}>구매 성공 </span>{' '}
            <br />
            <Tooltip title="누르면 제품 페이지로 이동">
              <StyledBlueSpan
                onClick={() => {
                  navigate(`/auction/product/${props.data.auction_id}`);
                }}
              >
                [{props.data.product_name}]
              </StyledBlueSpan>
            </Tooltip>
            <br/>
            <span style={{ color: 'gray' }}>최종 가격 : </span>
            <StyledRedSpan>{numberFormat(props.data.final_price)}</StyledRedSpan>
            
          </Grid>
          <Grid item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => {
                  // console.log("클릭", props.id)
                  ComponentHidden(props.id); //사라지는 애니메이션 back이랑 연동하는거 아님
                  props.setAlertCnt((data: any) => data - 1); //카운트 줄어듬
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Typography>
    </Paper>
  );
};

export default AlertItemSuccess;

// [구매 성공] {물품 이름}을 {경매 최종 가격} 에 구매하는 데에 성공하셨습니다.
// [구매 실패] {물품 이름}을 {본인이 입찰했던 가격} 가격에 구매하는 데에 실패하셨습니다.
// [판매 완료] {물품 이름}을 {경매 최종 가격}에 판매하는 데에 성공하셨습니다.
// [입찰 강탈] {물품 이름}에 새로운 입찰자가 나타났습니다. [현재 최고 가격 : {갱신된 경매 가격}]
